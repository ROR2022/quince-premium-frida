import { NextRequest, NextResponse } from 'next/server'
import connectDB from '@/lib/mongodb'
import Photo from '@/models/Photo'

interface PhotoData {
  // Identificación
  filename: string;
  originalName: string;
  
  // URLs y Storage
  cloudinaryId?: string;
  cloudinaryUrl?: string;
  localPath?: string;
  uploadSource: 'cloudinary' | 'local';
  
  // Metadata del archivo
  fileSize: number;
  mimeType: string;
  dimensions: {
    width: number;
    height: number;
  };
  
  // Información del usuario
  uploader: {
    name?: string;
    ip: string;
    userAgent: string;
  };
  
  // Contexto de la boda
  eventMoment?: string;
  comment?: string;
  
  // Control y moderación
  uploadedAt?: Date;
  isPublic?: boolean;
  status?: 'uploading' | 'ready' | 'processing' | 'error';
  moderationStatus?: 'pending' | 'approved' | 'rejected';
  
  // Metadata adicional
  tags?: string[];
}

export async function GET(request: NextRequest) {
  console.log('🔍 API Photos GET: Iniciando búsqueda de fotos');
  
  try {
    console.log('🔌 API Photos GET: Conectando a MongoDB...');
    await connectDB()
    console.log('✅ API Photos GET: Conexión a MongoDB exitosa');

    const { searchParams } = new URL(request.url)
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '20')
    const category = searchParams.get('category')
    const tag = searchParams.get('tag')
    const search = searchParams.get('search')
    // 🆕 Parámetros de ordenamiento
    const sortBy = searchParams.get('sortBy') || 'uploadedAt'
    const sortOrder = searchParams.get('sortOrder') || 'desc'

    console.log('📋 API Photos GET: Parámetros de búsqueda:', {
      page,
      limit,
      category,
      tag,
      search,
      sortBy,
      sortOrder,
      url: request.url
    });

    const query: Record<string, unknown> = {}
    
    if (category) {
      query.category = category
      console.log('🏷️ API Photos GET: Filtro por categoría:', category);
    }
    
    if (tag) {
      query.tags = { $in: [tag] }
      console.log('🏷️ API Photos GET: Filtro por tag:', tag);
    }
    
    if (search) {
      query.$or = [
        { description: { $regex: search, $options: 'i' } },
        { tags: { $in: [new RegExp(search, 'i')] } }
      ]
      console.log('🔍 API Photos GET: Filtro de búsqueda:', search);
    }

    console.log('📝 API Photos GET: Query final para MongoDB:', JSON.stringify(query, null, 2));

    // 🆕 Mapeo de campos de ordenamiento (frontend → MongoDB)
    const sortFieldMap: Record<string, string> = {
      'uploadedAt': 'uploadedAt',
      'viewCount': 'viewCount',
      'originalName': 'originalName',
      // Fallback para compatibilidad
      'uploadDate': 'uploadedAt'
    };

    // 🆕 Determinar campo y dirección de ordenamiento
    const sortField = sortFieldMap[sortBy] || 'uploadedAt';
    const sortDirection = sortOrder === 'asc' ? 1 : -1;
    const sortObject: Record<string, 1 | -1> = { [sortField]: sortDirection as 1 | -1 };

    console.log('🔄 API Photos GET: Configuración de ordenamiento:', {
      sortBy,
      sortOrder,
      sortField,
      sortDirection,
      sortObject
    });

    const skip = (page - 1) * limit
    console.log('📊 API Photos GET: Paginación - skip:', skip, 'limit:', limit);

    console.log('🔄 API Photos GET: Ejecutando consultas a MongoDB...');
    const [photos, total] = await Promise.all([
      Photo.find(query)
        .sort(sortObject)
        .skip(skip)
        .limit(limit)
        .lean(),
      Photo.countDocuments(query)
    ])

    console.log('📊 API Photos GET: Resultados obtenidos:', {
      photosFound: photos.length,
      totalInDB: total,
      currentPage: page,
      totalPages: Math.ceil(total / limit)
    });

    const response = {
      photos,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit)
      }
    };

    console.log('✅ API Photos GET: Respuesta preparada exitosamente');
    return NextResponse.json(response)
    
  } catch (error) {
    console.error('❌ API Photos GET: Error en búsqueda:', {
      error: error,
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined
    });
    
    return NextResponse.json(
      { error: 'Error interno del servidor', details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : error) : undefined },
      { status: 500 }
    )
  }
}

export async function POST(request: NextRequest) {
  console.log('💾 API Photos POST: Iniciando registro de foto en MongoDB');
  
  try {
    console.log('🔌 API Photos POST: Conectando a MongoDB...');
    await connectDB()
    console.log('✅ API Photos POST: Conexión a MongoDB exitosa');

    console.log('📝 API Photos POST: Parseando datos del request...');
    const photoData: PhotoData = await request.json()

    console.log('📸 API Photos POST: Datos de foto recibidos:', {
      filename: photoData.filename,
      originalName: photoData.originalName,
      uploadSource: photoData.uploadSource,
      fileSize: photoData.fileSize ? `${(photoData.fileSize / 1024 / 1024).toFixed(2)}MB` : 'No especificado',
      mimeType: photoData.mimeType,
      dimensions: photoData.dimensions,
      hasCloudinaryUrl: !!photoData.cloudinaryUrl,
      hasLocalPath: !!photoData.localPath,
      uploaderName: photoData.uploader?.name || 'Anónimo'
    });

    // Validación básica
    console.log('🔍 API Photos POST: Iniciando validaciones...');
    
    if (!photoData.filename) {
      console.error('❌ API Photos POST: filename es requerido');
      return NextResponse.json(
        { error: 'filename es requerido' },
        { status: 400 }
      )
    }

    if (!photoData.originalName) {
      console.error('❌ API Photos POST: originalName es requerido');
      return NextResponse.json(
        { error: 'originalName es requerido' },
        { status: 400 }
      )
    }

    if (!photoData.uploadSource) {
      console.error('❌ API Photos POST: uploadSource es requerido');
      return NextResponse.json(
        { error: 'uploadSource es requerido' },
        { status: 400 }
      )
    }

    // Validar que tenga al menos una URL
    if (!photoData.cloudinaryUrl && !photoData.localPath) {
      console.error('❌ API Photos POST: Se requiere cloudinaryUrl o localPath');
      return NextResponse.json(
        { error: 'Se requiere cloudinaryUrl o localPath' },
        { status: 400 }
      )
    }
    
    console.log('✅ API Photos POST: Validaciones básicas completadas');

    /**
     *  Antes de guardar, es necesario asegurarse de que
     *  el nombre de archivo (filename) sea único.
     *  para eso ademas del nombre se puede usar el campo cloudinaryId
     *  o una combinación de ambos.
     */
    console.log('🔧 API Photos POST: Procesando nombres de archivo únicos...');
    
    photoData.filename = photoData.filename.trim();
    photoData.originalName = photoData.originalName.trim();
    
    if (photoData.cloudinaryId) {
      console.log('☁️ API Photos POST: Usando cloudinaryId para filename único:', photoData.cloudinaryId);
      photoData.cloudinaryId = photoData.cloudinaryId.trim();
      photoData.filename = photoData.cloudinaryId;
      photoData.originalName = photoData.cloudinaryId;
    } else {
      // Si no tiene cloudinaryId, usar filename original + timestamp
      const timestamp = Date.now();
      const nameWithoutExt = photoData.filename.replace(/\.[^/.]+$/, "");
      const extension = photoData.filename.split('.').pop();
      const newFilename = `${nameWithoutExt}_${timestamp}.${extension}`;
      
      console.log('📁 API Photos POST: Generando filename único para sistema local:', {
        original: photoData.filename,
        nuevo: newFilename,
        timestamp
      });
      
      photoData.filename = newFilename;
      photoData.originalName = newFilename;
    }

    console.log('💾 API Photos POST: Creando documento en MongoDB...');
    const photo = new Photo({
      ...photoData,
      uploadedAt: photoData.uploadedAt || new Date(),
      isPublic: photoData.isPublic !== false, // Por defecto true
      status: photoData.status || 'ready',
      moderationStatus: photoData.moderationStatus || 'approved'
    })

    console.log('📝 API Photos POST: Documento preparado:', {
      id: photo._id,
      filename: photo.filename,
      uploadSource: photo.uploadSource,
      status: photo.status,
      moderationStatus: photo.moderationStatus
    });

    console.log('💾 API Photos POST: Guardando en MongoDB...');
    await photo.save()

    console.log('✅ API Photos POST: Foto guardada exitosamente en MongoDB:', {
      id: photo._id,
      filename: photo.filename,
      uploadedAt: photo.uploadedAt
    });

    return NextResponse.json(photo, { status: 201 })
    
  } catch (error) {
    console.error('❌ API Photos POST: Error creando foto:', {
      error: error,
      message: error instanceof Error ? error.message : 'Error desconocido',
      stack: error instanceof Error ? error.stack : undefined,
      name: error instanceof Error ? error.name : undefined
    });
    
    return NextResponse.json(
      { 
        error: 'Error interno del servidor', 
        details: error instanceof Error ? error.message : 'Unknown error',
        timestamp: new Date().toISOString()
      },
      { status: 500 }
    )
  }
}