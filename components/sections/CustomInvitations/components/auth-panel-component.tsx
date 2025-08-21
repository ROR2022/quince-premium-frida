// ================================================================
// 📁 components/AuthPanel.tsx
// ================================================================

import React from 'react';
import { AuthPanelProps } from '../types/invitation.types';
import { UI_MESSAGES, CSS_CLASSES } from '../constants/invitation.constants';

/**
 * Componente para el panel de autenticación de administrador
 */
export const AuthPanel: React.FC<AuthPanelProps> = ({
  authState,
  onUpdateAuth,
  onAuthenticate,
}) => {
  const { isAuthenticated, showAuthPopover, password, showPassword, authError } = authState;

  // Si está autenticado, mostrar badge de admin
  if (isAuthenticated) {
    return (
      <div className="flex items-center gap-2 px-3 py-2 bg-fuchsia-500 rounded-full shadow-lg">
        <div className="w-2 h-2 bg-white rounded-full animate-pulse"></div>
        <span className="text-white text-xs font-medium">
          {UI_MESSAGES.ADMIN_AUTHENTICATED}
        </span>
      </div>
    );
  }

  return (
    <div className="relative">
      {/* Botón de configuración */}
      <button
        onClick={() => onUpdateAuth({ showAuthPopover: !showAuthPopover })}
        className={`p-2 ${CSS_CLASSES.GRADIENT_SECONDARY} hover:from-fuchsia-600 hover:to-purple-800 rounded-full shadow-lg transition-colors`}
        title="Área de administración"
        aria-label="Abrir panel de administración"
      >
        <span role="img" aria-label="settings" className="text-white text-xl">⚙️</span>
      </button>

      {/* Popover de autenticación */}
      {showAuthPopover && (
        <div className="absolute top-12 right-0 w-80 bg-white rounded-xl shadow-2xl border-2 border-fuchsia-200 p-4 z-50">
          {/* Header del popover */}
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-fuchsia-700">Admin Panel</h3>
            <button
              onClick={() => onUpdateAuth({ showAuthPopover: false })}
              className="p-1 hover:bg-gray-100 rounded text-fuchsia-600 transition-colors"
              aria-label="Cerrar panel"
            >
              <span className="text-lg">✖️</span>
            </button>
          </div>

          {/* Formulario de autenticación */}
          <form onSubmit={onAuthenticate} className="space-y-3">
            {/* Campo de contraseña */}
            <div className="relative">
              <input
                type={showPassword ? "text" : "password"}
                value={password}
                onChange={(e) => onUpdateAuth({ password: e.target.value })}
                placeholder="Contraseña"
                className={`w-full px-3 text-black py-2 pr-10 border ${
                  authError ? "border-red-300 focus:ring-red-400" : "border-fuchsia-200 focus:ring-fuchsia-400"
                } rounded-lg text-sm focus:ring-2 focus:border-transparent transition-colors`}
                required
                autoComplete="current-password"
              />
              
              {/* Botón para mostrar/ocultar contraseña */}
              <button
                type="button"
                onClick={() => onUpdateAuth({ showPassword: !showPassword })}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-400 hover:text-gray-600 transition-colors"
                aria-label={showPassword ? "Ocultar contraseña" : "Mostrar contraseña"}
              >
                {showPassword ? "🙈" : "👁️"}
              </button>
            </div>

            {/* Mensaje de error */}
            {authError && (
              <div className="p-2 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-xs text-red-600 flex items-center gap-1">
                  <span>⚠️</span>
                  {authError}
                </p>
              </div>
            )}

            {/* Botón de acceso */}
            <button
              type="submit"
              className={`w-full ${CSS_CLASSES.GRADIENT_SECONDARY} hover:from-fuchsia-600 hover:to-purple-800 text-white py-2 rounded-lg font-bold transition-all shadow-md hover:shadow-lg`}
              disabled={!password.trim()}
            >
              Acceder
            </button>
          </form>

          {/* Información adicional */}
          <div className="mt-3 p-2 bg-gray-50 rounded-lg">
            <p className="text-xs text-gray-600 text-center">
              🔒 Panel exclusivo para administradores
            </p>
          </div>
        </div>
      )}

      {/* Overlay para cerrar el popover */}
      {showAuthPopover && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => onUpdateAuth({ showAuthPopover: false })}
          aria-hidden="true"
        />
      )}
    </div>
  );
};