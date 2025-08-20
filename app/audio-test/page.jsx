// Página de diagnóstico de audio
"use client"

import { useState, useRef, useEffect } from 'react'

export default function AudioDiagnostic() {
  const [status, setStatus] = useState('Esperando...')
  const [error, setError] = useState(null)
  const [audioInfo, setAudioInfo] = useState({})
  const [compatibilityInfo, setCompatibilityInfo] = useState({})
  const [mounted, setMounted] = useState(false)
  const audioRef = useRef(null)

  // Evitar hidration mismatch
  useEffect(() => {
    setMounted(true)
    
    // Verificar compatibilidad cuando el componente se monta
    if (typeof Audio !== 'undefined') {
      const audio = new Audio()
      setCompatibilityInfo({
        mp3: audio.canPlayType('audio/mpeg'),
        ogg: audio.canPlayType('audio/ogg'),
        wav: audio.canPlayType('audio/wav'),
        userAgent: navigator.userAgent
      })
    }
  }, [])

  const testAudio = async () => {
    if (typeof Audio === 'undefined') {
      setError({ general: 'Audio API no disponible' })
      return
    }

    setStatus('Probando audio...')
    setError(null)
    
    try {
      const audio = new Audio('/audio/musica.mp3')
      audioRef.current = audio
      
      // Eventos de información
      audio.addEventListener('loadstart', () => setStatus('Iniciando carga...'))
      audio.addEventListener('loadedmetadata', () => {
        setStatus('Metadatos cargados')
        setAudioInfo({
          duration: audio.duration,
          format: 'MP3',
          canPlay: audio.canPlayType('audio/mpeg')
        })
      })
      audio.addEventListener('loadeddata', () => setStatus('Datos cargados'))
      audio.addEventListener('canplay', () => setStatus('Listo para reproducir'))
      audio.addEventListener('canplaythrough', () => setStatus('Puede reproducir completamente'))
      
      // Eventos de error
      audio.addEventListener('error', (e) => {
        const error = audio.error
        setError({
          code: error?.code,
          message: error?.message,
          type: error?.constructor?.name
        })
        setStatus('Error al cargar')
      })
      
      // Cargar el audio
      audio.load()
      
    } catch (err) {
      setError({ general: err.message })
      setStatus('Error general')
    }
  }

  const playAudio = () => {
    if (audioRef.current) {
      audioRef.current.play()
        .then(() => setStatus('Reproduciendo'))
        .catch(err => setError({ play: err.message }))
    }
  }

  // No renderizar hasta que esté montado en el cliente
  if (!mounted) {
    return <div style={{ padding: '20px' }}>Cargando...</div>
  }

  return (
    <div style={{ padding: '20px', fontFamily: 'monospace' }}>
      <h1>🎵 Diagnóstico de Audio</h1>
      
      <div style={{ margin: '20px 0' }}>
        <button onClick={testAudio} style={{ padding: '10px', marginRight: '10px' }}>
          Probar Carga
        </button>
        <button onClick={playAudio} style={{ padding: '10px' }}>
          Reproducir
        </button>
      </div>
      
      <div style={{ background: '#f0f0f0', padding: '15px', marginBottom: '10px' }}>
        <h3>Estado: {status}</h3>
      </div>
      
      {audioInfo.duration && (
        <div style={{ background: '#e0ffe0', padding: '15px', marginBottom: '10px' }}>
          <h3>Información del Audio:</h3>
          <p>Duración: {audioInfo.duration} segundos</p>
          <p>Formato: {audioInfo.format}</p>
          <p>Soporte MP3: {audioInfo.canPlay}</p>
        </div>
      )}
      
      {error && (
        <div style={{ background: '#ffe0e0', padding: '15px' }}>
          <h3>Error:</h3>
          <pre>{JSON.stringify(error, null, 2)}</pre>
        </div>
      )}
      
      <div style={{ marginTop: '20px' }}>
        <h3>Tests de Compatibilidad:</h3>
        <p>MP3: {compatibilityInfo.mp3 || 'N/A'}</p>
        <p>OGG: {compatibilityInfo.ogg || 'N/A'}</p>
        <p>WAV: {compatibilityInfo.wav || 'N/A'}</p>
        <p>User Agent: {compatibilityInfo.userAgent || 'N/A'}</p>
      </div>
    </div>
  )
}
