// 🎯 Hook principal para manejo del scanner QR - Aurora VIP Design
'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import QrScanner from 'qr-scanner';
import type { 
  SimpleReadQRState, 
  QRScannerConfig,
  QRScanResult,
  ScanMode 
} from './ReadQR.types';

// 🛠️ Funciones de utilidad locales
const detectContentType = (content: string) => {
  // Detectar URL
  if (content.startsWith('http://') || content.startsWith('https://')) {
    return {
      type: 'url' as const,
      isValid: true,
      actions: ['open', 'copy']
    };
  }
  
  // Detectar email
  if (content.includes('@') && content.includes('.')) {
    return {
      type: 'email' as const,
      isValid: true,
      actions: ['mailto', 'copy']
    };
  }
  
  // Detectar teléfono
  if (/^[\+]?[0-9\s\-\(\)]{7,15}$/.test(content.replace(/\s/g, ''))) {
    return {
      type: 'phone' as const,
      isValid: true,
      actions: ['call', 'copy']
    };
  }
  
  // Por defecto es texto
  return {
    type: 'text' as const,
    isValid: true,
    actions: ['copy']
  };
};

const handleContentAction = async (action: string, content: string) => {
  switch (action) {
    case 'open':
      window.open(content, '_blank');
      break;
    case 'mailto':
      window.location.href = `mailto:${content}`;
      break;
    case 'call':
      window.location.href = `tel:${content}`;
      break;
    case 'copy':
      await navigator.clipboard.writeText(content);
      break;
  }
};

const checkCameraAvailability = async (): Promise<boolean> => {
  try {
    return await QrScanner.hasCamera();
  } catch {
    return false;
  }
};

const scanImageFile = async (file: File): Promise<string> => {
  try {
    const result = await QrScanner.scanImage(file);
    return result;
  } catch (error) {
    console.error('Error escaneando imagen:', error);
    throw new Error('No se pudo leer el código QR de la imagen');
  }
};

const handleScannerError = (error: unknown): string => {
  if (error instanceof Error) {
    return error.message;
  }
  return 'Error desconocido del scanner';
};

const getDeviceInfo = async () => {
  const hasCamera = await checkCameraAvailability();
  return { hasCamera };
};

interface UseQRScannerOptions {
  mode?: ScanMode;
  autoStart?: boolean;
  onResult?: (result: QRScanResult) => void;
  onError?: (error: string) => void;
  config?: Partial<QRScannerConfig>;
}

export function useQRScanner(options: UseQRScannerOptions = {}) {
  // 🎯 Estados principales
  const [state, setState] = useState<SimpleReadQRState>({
    mode: options.mode || 'camera',
    isScanning: false,
    hasPermission: false,
    error: null,
    result: null,
    isLoading: false,
    hasCamera: false
  });

  // 📹 Referencias
  const videoRef = useRef<HTMLVideoElement>(null);
  const scannerRef = useRef<QrScanner | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // ⚙️ Configuración del scanner
  const config: QRScannerConfig = {
    highlightScanRegion: true,
    highlightCodeOutline: true,
    maxScansPerSecond: 5,
    preferredCamera: 'environment',
    returnDetailedScanResult: true,
    calculateScanRegion: (video) => {
      const smallerDimension = Math.min(video.videoWidth, video.videoHeight);
      const scanRegionSize = Math.round(0.7 * smallerDimension);
      return {
        x: Math.round((video.videoWidth - scanRegionSize) / 2),
        y: Math.round((video.videoHeight - scanRegionSize) / 2),
        width: scanRegionSize,
        height: scanRegionSize,
      };
    },
    ...options.config
  };

  // 🔍 Función para procesar resultado del escaneo
  const processQRResult = useCallback((data: string): QRScanResult => {
    try {
      const contentInfo = detectContentType(data);
      const result: QRScanResult = {
        data,
        timestamp: new Date(),
        contentType: contentInfo.type,
        isValid: contentInfo.isValid,
        actions: contentInfo.actions,
        error: null
      };

      // Callback opcional
      options.onResult?.(result);
      
      return result;
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error procesando QR';
      options.onError?.(errorMessage);
      
      return {
        data,
        timestamp: new Date(),
        contentType: 'text',
        isValid: false,
        actions: [],
        error: errorMessage
      };
    }
  }, [options]);

  // 📹 Inicializar cámara
  const initializeCamera = useCallback(async () => {
    // Evitar múltiples llamadas simultáneas
    if (state.isLoading || state.isScanning) return;
    
    try {
      console.log('🎥 Iniciando inicialización de cámara...');
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      // Verificar si estamos en HTTPS o localhost
      const isSecureContext = window.isSecureContext || window.location.hostname === 'localhost';
      console.log('🔒 Contexto seguro:', isSecureContext, 'Protocol:', window.location.protocol);

      // Verificar disponibilidad de cámara
      const cameraAvailable = await checkCameraAvailability();
      console.log('📷 Cámara disponible:', cameraAvailable);
      
      if (!cameraAvailable) {
        throw new Error('No se detectó ninguna cámara disponible');
      }

      // Esperar a que el elemento de video esté disponible
      let attempts = 0;
      const maxAttempts = 10;
      
      console.log('🔍 Buscando elemento de video...');
      while (!videoRef.current && attempts < maxAttempts) {
        await new Promise(resolve => setTimeout(resolve, 100));
        attempts++;
        console.log(`📹 Intento ${attempts}/${maxAttempts} - Video element:`, !!videoRef.current);
      }

      // Verificar elemento de video
      if (!videoRef.current) {
        throw new Error('Elemento de video no disponible después de esperar');
      }

      console.log('✅ Elemento de video encontrado, creando scanner...');

      // Crear scanner
      const scanner = new QrScanner(videoRef.current, (result: string) => {
        console.log('🎯 QR detectado:', result);
        const processedResult = processQRResult(result);
        setState(prev => ({ 
          ...prev, 
          result: processedResult,
          isScanning: false 
        }));
        
        // Pausar scanner después de detectar
        scanner.pause();
      });

      // Configurar scanner después de crearlo
      scanner.setInversionMode('both');
      
      scannerRef.current = scanner;

      console.log('🚀 Iniciando scanner...');
      // Iniciar scanner
      await scanner.start();

      console.log('✅ Scanner iniciado exitosamente');
      
      // Forzar que el video sea visible
      if (videoRef.current) {
        videoRef.current.style.display = 'block';
        videoRef.current.style.visibility = 'visible';
        console.log('📺 Video forzado a ser visible');
      }

      setState(prev => ({
        ...prev,
        isScanning: true,
        hasPermission: true,
        hasCamera: true,
        isLoading: false,
        error: null
      }));

    } catch (error) {
      console.error('❌ Error en initializeCamera:', error);
      let errorMessage = handleScannerError(error);
      
      // Mensaje específico para problemas de HTTPS
      if (errorMessage.includes('camera stream') || errorMessage.includes('https')) {
        errorMessage = 'Para usar la cámara, necesitas HTTPS. Prueba con: https://localhost:3000/qrcode/read';
      }
      
      setState(prev => ({
        ...prev,
        isScanning: false,
        hasPermission: false,
        isLoading: false,
        error: errorMessage
      }));
      
      options.onError?.(errorMessage);
    }
  }, [state.isLoading, state.isScanning, processQRResult, options]);

  // ⏹️ Detener cámara
  const stopCamera = useCallback(() => {
    try {
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }

      setState(prev => ({
        ...prev,
        isScanning: false,
        hasPermission: false,
        error: null
      }));
    } catch (error) {
      console.error('Error deteniendo cámara:', error);
    }
  }, []);

  // 🔄 Reanudar escaneo
  const resumeScanning = useCallback(async () => {
    try {
      if (scannerRef.current && !state.isScanning) {
        await scannerRef.current.start();
        setState(prev => ({ 
          ...prev, 
          isScanning: true, 
          result: null,
          error: null 
        }));
      } else if (!scannerRef.current) {
        // Si no hay scanner, inicializar desde cero
        await initializeCamera();
      }
    } catch (error) {
      const errorMessage = handleScannerError(error);
      setState(prev => ({ ...prev, error: errorMessage }));
      options.onError?.(errorMessage);
    }
  }, [state.isScanning, initializeCamera, options]);

  // 📁 Procesar archivo de imagen
  const processImageFile = useCallback(async (file: File) => {
    try {
      setState(prev => ({ ...prev, isLoading: true, error: null }));

      const data = await scanImageFile(file);
      const result = processQRResult(data);

      setState(prev => ({
        ...prev,
        result,
        isLoading: false,
        error: null
      }));

    } catch (error) {
      const errorMessage = handleScannerError(error);
      setState(prev => ({
        ...prev,
        isLoading: false,
        error: errorMessage,
        result: null
      }));
      
      options.onError?.(errorMessage);
    }
  }, [processQRResult, options]);

  // 🔄 Cambiar modo
  const changeMode = useCallback((newMode: ScanMode) => {
    if (newMode === state.mode) return;

    // Detener cámara si está activa
    if (state.isScanning && newMode === 'file') {
      stopCamera();
    }

    setState(prev => ({
      ...prev,
      mode: newMode,
      result: null,
      error: null,
      isLoading: false
    }));

    // Auto-iniciar cámara si se cambia a modo cámara
    if (newMode === 'camera' && options.autoStart !== false) {
      setTimeout(() => initializeCamera(), 100);
    }
  }, [state.mode, state.isScanning, stopCamera, initializeCamera, options.autoStart]);

  // 🎬 Ejecutar acción de contenido
  const executeAction = useCallback(async (actionType: string, content: string) => {
    try {
      setState(prev => ({ ...prev, isLoading: true }));
      
      await handleContentAction(actionType, content);
      
      setState(prev => ({ ...prev, isLoading: false }));
      
      // Mostrar mensaje de éxito (opcional)
      // toast.success(`Acción ${actionType} ejecutada correctamente`);
      
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Error ejecutando acción';
      setState(prev => ({ 
        ...prev, 
        isLoading: false,
        error: errorMessage 
      }));
      
      options.onError?.(errorMessage);
    }
  }, [options]);

  // 🔄 Limpiar resultado
  const clearResult = useCallback(() => {
    setState(prev => ({
      ...prev,
      result: null,
      error: null
    }));
  }, []);

  // 🔄 Reiniciar scanner
  const resetScanner = useCallback(() => {
    stopCamera();
    setState(prev => ({
      ...prev,
      result: null,
      error: null,
      isLoading: false,
      isScanning: false,
      hasPermission: false
    }));
  }, [stopCamera]);

  // 📱 Verificar capacidades del dispositivo
  useEffect(() => {
    const checkDeviceCapabilities = async () => {
      try {
        const deviceInfo = await getDeviceInfo();
        setState(prev => ({
          ...prev,
          hasCamera: deviceInfo.hasCamera
        }));
      } catch (error) {
        console.warn('No se pudieron verificar las capacidades del dispositivo:', error);
      }
    };

    checkDeviceCapabilities();
  }, []);

  // 🎬 Auto-iniciar si está configurado
  useEffect(() => {
    let mounted = true;
    
    const autoStart = async () => {
      if (
        mounted &&
        state.mode === 'camera' && 
        options.autoStart !== false && 
        !state.isScanning && 
        !state.error && 
        !state.isLoading &&
        videoRef.current
      ) {
        await initializeCamera();
      }
    };

    // Pequeño delay para asegurar que el video element esté disponible
    const timer = setTimeout(autoStart, 100);

    return () => {
      mounted = false;
      clearTimeout(timer);
      if (scannerRef.current) {
        scannerRef.current.stop();
        scannerRef.current.destroy();
        scannerRef.current = null;
      }
    };
  }, [state.mode, options.autoStart, state.isScanning, state.error, state.isLoading, initializeCamera]);

  // 🧹 Cleanup al desmontar
  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, [stopCamera]);

  return {
    // Estados
    ...state,
    
    // Referencias
    videoRef,
    fileInputRef,
    
    // Acciones principales
    initializeCamera,
    stopCamera,
    resumeScanning,
    processImageFile,
    changeMode,
    executeAction,
    clearResult,
    resetScanner,
    
    // Utilidades
    isSupported: QrScanner.hasCamera,
    canScanFiles: true,
    
    // Configuración
    config
  };
}
