// 📅 DateSection - Sección de fecha y countdown

import React from 'react'
import CountdownTimer from '../countdown-timer'
import { weddingData } from '../../data/weddingData'
import { getOverlayStyle } from '@/utils/overlay'
import { useScrollAnimation } from '@/hooks/useScrollAnimation'
import { getAnimationConfig } from '@/data/animationConfig'
import Image from 'next/image'

export default function DateSection() {
  const { wedding, messages, styling } = weddingData
  const { dateSection } = styling

  // Configurar animación de scroll con fallback de carga inmediata
  const animationConfig = getAnimationConfig('date')
  const { ref: sectionRef, style: animationStyle } = useScrollAnimation(
    animationConfig.options,
    'fadeIn', // Animación más suave
    animationConfig.delay,
    true // Carga inmediata como fallback
  )

  return (
    <section 
      ref={sectionRef}
      style={{
        
        /* backgroundImage: `url('/images/campo1.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat', */
        position: 'relative',
        //...animationStyle
      }} 
    id="date" className="py-20">

    {/* Overlay configurable */}
       {/* <div 
        style={getOverlayStyle(dateSection)}
        className="absolute inset-0 z-0"
      ></div>  */}

      <div 
        style={{
          // Remover animación CSS duplicada, usar solo scroll animation
          willChange: 'transform, opacity' // Optimización para móviles
        }}
        className="container bg-slate-300 bg-opacity-60 rounded-b-2xl p-6 mx-auto px-4  p-6 rounded-2xl"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <p className="text-lg text-muted-foreground italic">
            {messages.dateMessage}
          </p>

          <h2 className="font-script text-4xl text-secondary">FECHA ESPECIAL</h2>

          <div className="bg-primary/20 rounded-3xl p-12 max-w-md mx-auto">
            <div className="text-2xl font-medium text-foreground mb-2">
              {wedding.dayName}
            </div>
            <div 
            
            className='flex justify-center gap-3'>
              <div
              style={{display:'none'}}
              >
                <Image
                  src="/images/decoration1a.png"
                  alt="Fecha"
                  width={100}
                  height={100}
                />
              </div>
            <div className="text-8xl font-bold text-primary mb-2">
              {wedding.day}
            </div>
            <div
            style={{display:'none'}}
            >
              <Image
                src="/images/decoration1b.png"
                alt="Fecha"
                width={100}
                height={100}
              />
            </div>
            </div>
            <div className="text-2xl font-medium text-foreground mb-2">
              {wedding.month}
            </div>
            <div className="text-3xl font-medium text-foreground">
              {wedding.year}
            </div>
          </div>

          <h3 className="font-script text-3xl text-secondary">
            {messages.countdownTitle}
          </h3>

          <CountdownTimer />
        </div>
      </div>
    </section>
  )
}
