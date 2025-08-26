"use client";
import React, { useState, useRef, useEffect } from 'react'
import { Play, Pause, Volume2 } from 'lucide-react'

const SimpleMusicPlayer = () => {
    const music = '/audio/galeria.mp3';
    const [isPlaying, setIsPlaying] = useState(false);
    const [isHovered, setIsHovered] = useState(false);
    const audioRef = useRef<HTMLAudioElement>(null);

    const togglePlay = () => {
        if (audioRef.current) {
            if (isPlaying) {
                audioRef.current.pause();
            } else {
                audioRef.current.play();
            }
            setIsPlaying(!isPlaying);
        }
    };

    useEffect(() => {
        const audio = audioRef.current;
        if (audio) {
            const handleEnded = () => setIsPlaying(false);
            audio.addEventListener('ended', handleEnded);
            return () => audio.removeEventListener('ended', handleEnded);
        }
    }, []);

    return (
        <div 
            className="fixed bottom-6 right-6 z-50 group"
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            {/* Audio element oculto */}
            <audio ref={audioRef} preload="metadata">
                <source src={music} type="audio/mpeg" />
                Your browser does not support the audio element.
            </audio>

            {/* Botón principal */}
            <button
                onClick={togglePlay}
                className={`
                    relative flex items-center justify-center
                    w-14 h-14 rounded-full
                    bg-gradient-to-br from-pink-500 via-rose-500 to-pink-600
                    shadow-lg hover:shadow-xl
                    transition-all duration-300 ease-out
                    hover:scale-110 active:scale-95
                    border-2 border-white/20
                    backdrop-blur-sm
                    ${isPlaying ? 'animate-pulse' : ''}
                `}
                aria-label={isPlaying ? 'Pausar música' : 'Reproducir música'}
            >
                {/* Efecto de ondas cuando está reproduciendo */}
                {isPlaying && (
                    <div className="absolute inset-0 rounded-full border-2 border-pink-300 animate-ping opacity-75" />
                )}
                
                {/* Icono */}
                <div className="relative z-10 text-white">
                    {isPlaying ? (
                        <Pause size={20} fill="currentColor" />
                    ) : (
                        <Play size={20} fill="currentColor" className="ml-0.5" />
                    )}
                </div>

                {/* Brillo sutil */}
                <div className="absolute inset-0 rounded-full bg-gradient-to-tr from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
            </button>

            {/* Indicador de volumen animado */}
            {isPlaying && (
                <div className="absolute -left-16 top-1/2 transform -translate-y-1/2 flex items-center space-x-1">
                    <Volume2 size={16} className="text-pink-500" />
                    <div className="flex space-x-0.5">
                        {[1, 2, 3].map((i) => (
                            <div
                                key={i}
                                className={`
                                    w-1 bg-pink-500 rounded-full
                                    animate-bounce
                                `}
                                style={{
                                    height: `${8 + i * 4}px`,
                                    animationDelay: `${i * 0.1}s`,
                                    animationDuration: '0.6s'
                                }}
                            />
                        ))}
                    </div>
                </div>
            )}

            {/* Tooltip */}
            {isHovered && (
                <div className="absolute bottom-full right-0 mb-2 px-3 py-1 bg-black/80 text-white text-xs rounded-lg whitespace-nowrap backdrop-blur-sm">
                    {isPlaying ? 'Pausar música' : 'Reproducir música'}
                    <div className="absolute top-full right-3 w-0 h-0 border-l-2 border-r-2 border-t-4 border-transparent border-t-black/80" />
                </div>
            )}
        </div>
    )
}

export default SimpleMusicPlayer