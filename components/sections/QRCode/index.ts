// Exportaciones centralizadas para componentes QRCode

export { default as QRCode } from './QRCode';
export { default as QRDownloadCard } from './QRDownloadCard';
export { default as QRDownloadButton } from './QRDownloadButton';
export { default as QRDownloadContainer } from './QRDownloadContainer';

// Re-exportar tipos relevantes
export type {
  QRDownloadCardProps,
  QRDownloadButtonProps
} from '@/types/qrDownload.types';
