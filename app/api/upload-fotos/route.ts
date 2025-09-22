// 📸 API Endpoint - Upload de fotos para invitados VIP
// POST /api/upload-fotos

import { NextRequest, NextResponse } from 'next/server';
import { writeFile, mkdir } from 'fs/promises';
import { existsSync } from 'fs';
import path from 'path';

// Importación defensiva de Sharp para Vercel
async function getSharp(): Promise<typeof import('sharp') | null> {
  try {
    const sharpModule = await import('sharp');
    return sharpModule.default;
  } catch (error) {
    console.warn('Sharp no disponible, usando fallback sin compresión:', error);
    return null;
  }
}

// Configuración del upload
const UPLOAD_CONFIG = {
  maxFileSize: 10 * 1024 * 1024, // 10MB
  allowedTypes: ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'],
  maxFiles: 10,
  uploadDir: path.join(process.cwd(), 'public', 'uploads', 'boda-maribel-godofredo'),
  compressionQuality: 85,
  maxDimensions: { width: 2000, height: 2000 }
};

// Función para sanitizar nombres de archivo
const sanitizeFileName = (fileName: string): string => {
  return fileName
    .replace(/[^a-zA-Z0-9.-]/g, '_')
    .replace(/_+/g, '_')
    .replace(/^_|_$/g, '')
    .toLowerCase();
};

// Función para generar nombre único
const generateUniqueFileName = (originalName: string): string => {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substr(2, 9);
  const extension = path.extname(originalName);
  const nameWithoutExt = path.basename(originalName, extension);
  const sanitizedName = sanitizeFileName(nameWithoutExt);
  
  return `${timestamp}_${random}_${sanitizedName}${extension}`;
};

// Función para crear directorios necesarios
const ensureDirectories = async () => {
  try {
    const today = new Date().toISOString().split('T')[0];
    console.log('📅 Creating directories for date:', today);
    
    const directories = [
      path.join(UPLOAD_CONFIG.uploadDir, 'fotos', today, 'original'),
      path.join(UPLOAD_CONFIG.uploadDir, 'fotos', today, 'compressed'),
      path.join(UPLOAD_CONFIG.uploadDir, 'thumbnails', today),
      path.join(UPLOAD_CONFIG.uploadDir, 'metadata'),
      path.join(UPLOAD_CONFIG.uploadDir, 'logs')
    ];

    for (const dir of directories) {
      if (!existsSync(dir)) {
        console.log('📁 Creating directory:', dir);
        await mkdir(dir, { recursive: true });
        console.log('✅ Directory created:', dir);
      } else {
        console.log('📂 Directory already exists:', dir);
      }
    }

    console.log('✅ All directories ready');
    return today;
  } catch (error) {
    console.error('❌ Error creating directories:', error);
    throw new Error(`Directory creation failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Función para comprimir imagen
const compressImage = async (
  buffer: Buffer,
  fileName: string,
  today: string
): Promise<{ compressed: string; thumbnail: string }> => {
  try {
    const nameWithoutExt = path.basename(fileName, path.extname(fileName));
    const compressedName = `${nameWithoutExt}.webp`;
    const thumbnailName = `${nameWithoutExt}_thumb.webp`;

    const compressedPath = path.join(UPLOAD_CONFIG.uploadDir, 'fotos', today, 'compressed', compressedName);
    const thumbnailPath = path.join(UPLOAD_CONFIG.uploadDir, 'thumbnails', today, thumbnailName);

    console.log('🔄 Compressing image:', fileName);
    console.log('📁 Compressed path:', compressedPath);
    console.log('📁 Thumbnail path:', thumbnailPath);

    // Obtener Sharp dinámicamente
    const sharp = await getSharp();
    
    // Verificar que Sharp esté disponible
    if (!sharp) {
      console.warn('⚠️  Sharp not available, using fallback without compression');
      
      // Fallback: guardar imagen original sin compresión
      await writeFile(compressedPath, buffer);
      await writeFile(thumbnailPath, buffer);
      
      return {
        compressed: `/uploads/boda-maribel-godofredo/fotos/${today}/compressed/${compressedName}`,
        thumbnail: `/uploads/boda-maribel-godofredo/fotos/${today}/thumbnails/${thumbnailName}`
      };
    }

    // Comprimir imagen principal
    await sharp(buffer)
      .resize(UPLOAD_CONFIG.maxDimensions.width, UPLOAD_CONFIG.maxDimensions.height, {
        fit: 'inside',
        withoutEnlargement: true
      })
      .webp({ quality: UPLOAD_CONFIG.compressionQuality })
      .toFile(compressedPath);

    console.log('✅ Compressed image created');

    // Crear thumbnail
    await sharp(buffer)
      .resize(300, 300, {
        fit: 'cover',
        position: 'center'
      })
      .webp({ quality: 80 })
      .toFile(thumbnailPath);

    console.log('✅ Thumbnail created');

    return {
      compressed: `/uploads/boda-maribel-godofredo/fotos/${today}/compressed/${compressedName}`,
      thumbnail: `/uploads/boda-maribel-godofredo/thumbnails/${today}/${thumbnailName}`
    };
  } catch (error) {
    console.error('❌ Error in image compression:', error);
    throw new Error(`Image compression failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
  }
};

// Función para guardar metadata
const saveMetadata = async (uploadData: {
  id: string;
  timestamp: string;
  date: string;
  uploaderName: string;
  eventMoment: string;
  comment: string;
  totalFiles: number;
  totalSize: number;
  files: Array<{
    originalName: string;
    fileName: string;
    size: number;
    type: string;
    paths: {
      original: string;
      compressed: string;
      thumbnail: string;
    };
  }>;
  userAgent: string;
}) => {
  const metadataPath = path.join(UPLOAD_CONFIG.uploadDir, 'metadata', 'uploads.json');
  const logPath = path.join(UPLOAD_CONFIG.uploadDir, 'logs', 'upload-history.log');

  try {
    // Leer metadata existente
    let existingData = [];
    if (existsSync(metadataPath)) {
      const data = await import('fs').then(fs => 
        fs.promises.readFile(metadataPath, 'utf-8')
      );
      existingData = JSON.parse(data);
    }

    // Agregar nueva entrada
    existingData.push(uploadData);

    // Guardar metadata actualizada
    await writeFile(metadataPath, JSON.stringify(existingData, null, 2));

    // Log de upload
    const logEntry = `${new Date().toISOString()} - Upload: ${uploadData.files.length} files by ${uploadData.uploaderName || 'Anonymous'}\n`;
    await writeFile(logPath, logEntry, { flag: 'a' });

  } catch (error) {
    console.error('Error saving metadata:', error);
  }
};

export async function POST(request: NextRequest) {
  console.log('📁 API Upload Local POST: Iniciando proceso de upload local');
  console.log('🌐 API Upload Local POST: Request info:', {
    url: request.url,
    method: request.method,
    headers: {
      contentType: request.headers.get('content-type'),
      userAgent: request.headers.get('user-agent'),
      origin: request.headers.get('origin')
    }
  });

  try {
    console.log('📝 API Upload Local POST: Obteniendo FormData...');
    
    // Obtener FormData
    const formData = await request.formData();
    const files = formData.getAll('file') as File[];
    const uploaderName = formData.get('uploaderName') as string;
    const userName = formData.get('userName') as string;
    const eventMoment = formData.get('eventMoment') as string;
    const comment = formData.get('comment') as string;

    console.log('📊 API Upload Local POST: Datos recibidos:', {
      filesCount: files.length,
      uploaderName: uploaderName || 'No especificado',
      userName: userName || 'No especificado',
      eventMoment: eventMoment || 'No especificado',
      comment: comment ? `"${comment.substring(0, 50)}..."` : 'No especificado',
      files: files.map(f => ({
        name: f.name,
        size: `${(f.size / 1024 / 1024).toFixed(2)}MB`,
        type: f.type
      }))
    });

    // Validar que hay archivos
    if (!files || files.length === 0) {
      console.error('❌ API Upload Local POST: No se recibieron archivos');
      return NextResponse.json(
        { success: false, message: 'No se recibieron archivos' },
        { status: 400 }
      );
    }

    // Validar número de archivos
    if (files.length > UPLOAD_CONFIG.maxFiles) {
      console.error('❌ API Upload Local POST: Demasiados archivos:', {
        received: files.length,
        maxAllowed: UPLOAD_CONFIG.maxFiles
      });
      return NextResponse.json(
        { success: false, message: `Máximo ${UPLOAD_CONFIG.maxFiles} archivos permitidos` },
        { status: 400 }
      );
    }

    // Crear directorios necesarios
    console.log('📁 API Upload Local POST: Creando directorios necesarios...');
    const today = await ensureDirectories();
    console.log(`✅ API Upload Local POST: Directorios creados para fecha: ${today}`);

    // Procesar cada archivo
    console.log('🔄 API Upload Local POST: Iniciando procesamiento de archivos...');
    const processedFiles = [];
    
    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      console.log(`� API Upload Local POST: Procesando archivo ${i + 1}/${files.length}:`, {
        name: file.name,
        size: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
        type: file.type,
        lastModified: new Date(file.lastModified).toISOString()
      });

      try {
        // Validar tipo de archivo
        if (!UPLOAD_CONFIG.allowedTypes.includes(file.type)) {
          console.error('❌ API Upload Local POST: Tipo de archivo no permitido:', {
            fileName: file.name,
            fileType: file.type,
            allowedTypes: UPLOAD_CONFIG.allowedTypes
          });
          throw new Error(`Tipo de archivo no permitido: ${file.type}`);
        }

        // Validar tamaño
        if (file.size > UPLOAD_CONFIG.maxFileSize) {
          console.error('❌ API Upload Local POST: Archivo demasiado grande:', {
            fileName: file.name,
            fileSize: `${(file.size / 1024 / 1024).toFixed(2)}MB`,
            maxSize: `${(UPLOAD_CONFIG.maxFileSize / 1024 / 1024).toFixed(2)}MB`
          });
          throw new Error(`Archivo demasiado grande: ${file.name}`);
        }

        // Convertir a buffer
        console.log('🔄 API Upload Local POST: Convirtiendo archivo a buffer...');
        const bytes = await file.arrayBuffer();
        const buffer = Buffer.from(bytes);
        console.log(`✅ API Upload Local POST: Buffer creado, tamaño: ${(buffer.length / 1024 / 1024).toFixed(2)}MB`);

        // Generar nombre único
        const uniqueFileName = generateUniqueFileName(file.name);
        console.log('📝 API Upload Local POST: Nombre único generado:', {
          original: file.name,
          unique: uniqueFileName
        });
        
        // Guardar archivo original
        const originalPath = path.join(UPLOAD_CONFIG.uploadDir, 'fotos', today, 'original', uniqueFileName);
        console.log('💾 API Upload Local POST: Guardando archivo original en:', originalPath);
        await writeFile(originalPath, buffer);
        console.log('✅ API Upload Local POST: Archivo original guardado exitosamente');

        // Comprimir y crear thumbnail
        console.log('🔄 API Upload Local POST: Iniciando compresión de imagen...');
        const { compressed, thumbnail } = await compressImage(buffer, uniqueFileName, today);
        console.log('✅ API Upload Local POST: Compresión completada:', {
          compressed,
          thumbnail
        });

        const fileData = {
          id: `${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
          originalName: file.name,
          fileName: uniqueFileName,
          size: file.size,
          type: file.type,
          paths: {
            original: `/uploads/boda-maribel-godofredo/fotos/${today}/original/${uniqueFileName}`,
            compressed,
            thumbnail
          },
          uploadedAt: new Date().toISOString(),
          uploaderName: uploaderName || userName || 'Anónimo',
          eventMoment: eventMoment || 'No especificado',
          comment: comment || ''
        };

        processedFiles.push(fileData);
        console.log(`🎉 API Upload Local POST: Archivo procesado exitosamente: ${file.name}`);
        
      } catch (fileError) {
        console.error(`❌ API Upload Local POST: Error procesando archivo ${file.name}:`, {
          error: fileError,
          message: fileError instanceof Error ? fileError.message : 'Error desconocido',
          stack: fileError instanceof Error ? fileError.stack : undefined
        });
        
        // Si es un error crítico, devolver error 400
        return NextResponse.json(
          { 
            success: false, 
            message: `Error procesando ${file.name}: ${fileError instanceof Error ? fileError.message : 'Error desconocido'}`,
            error: 'FILE_PROCESSING_ERROR',
            fileName: file.name,
            timestamp: new Date().toISOString()
          },
          { status: 400 }
        );
      }
    }

    console.log('✅ API Upload Local POST: Todos los archivos procesados exitosamente');

    // Guardar metadata
    console.log('💾 API Upload Local POST: Guardando metadata del upload...');
    const uploadMetadata = {
      id: `upload_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      date: today,
      uploaderName: uploaderName || userName || 'Anónimo',
      eventMoment: eventMoment || 'No especificado',
      comment: comment || '',
      totalFiles: processedFiles.length,
      totalSize: files.reduce((sum, file) => sum + file.size, 0),
      files: processedFiles,
      userAgent: request.headers.get('user-agent') || 'Unknown'
    };

    await saveMetadata(uploadMetadata);
    console.log('✅ API Upload Local POST: Metadata guardada exitosamente');

    console.log(`🎉 API Upload Local POST: Upload completado exitosamente: ${processedFiles.length} archivos`);

    // Respuesta exitosa
    const response = {
      success: true,
      message: `${processedFiles.length} foto${processedFiles.length > 1 ? 's' : ''} subida${processedFiles.length > 1 ? 's' : ''} exitosamente`,
      data: {
        uploadId: uploadMetadata.id,
        totalFiles: processedFiles.length,
        files: processedFiles,
        timestamp: uploadMetadata.timestamp
      }
    };

    console.log('✅ API Upload Local POST: Respuesta preparada exitosamente');
    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ API Upload Local POST: Error general en upload:', {
      error: error,
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    const errorMessage = error instanceof Error ? error.message : 'Error desconocido';
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'Error interno del servidor durante la subida',
        error: process.env.NODE_ENV === 'development' ? errorMessage : undefined,
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    );
  }
}

// Método OPTIONS para CORS (si es necesario)
export async function OPTIONS() {
  return new NextResponse(null, {
    status: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
    },
  });
}
