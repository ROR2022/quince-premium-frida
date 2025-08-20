// 👨‍👩‍👧‍👦 ParentsSection - Sección de información de padres

import React from 'react'
import Image from 'next/image'
import { weddingData } from '../../data/weddingData'

export default function ParentsSection() {
  const { parents } = weddingData

  return (
    <section id="parents" className="py-20 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto">
          <div className="relative">
            <Image
              src="/images/floral-border.png"
              alt="Decoración floral"
              fill
              className="opacity-20 object-cover"
              sizes="100vw"
            />
            <div className="relative z-10 text-center space-y-8 py-12">
              <p className="text-lg text-muted-foreground italic max-w-2xl mx-auto leading-relaxed">
                {parents.message}
              </p>

              <div className="space-y-8">
                <div>
                  <h3 className="font-script text-3xl text-secondary mb-4">
                    Papás de la novia
                  </h3>
                  <div className="space-y-2">
                    <p className="text-xl font-medium">{parents.bride.mother}</p>
                    <p className="text-xl font-medium">{parents.bride.father}</p>
                  </div>
                </div>

                <div>
                  <h3 className="font-script text-3xl text-secondary mb-4">
                    Papás del novio
                  </h3>
                  <div className="space-y-2">
                    <p className="text-xl font-medium">{parents.groom.mother}</p>
                    <p className="text-xl font-medium">{parents.groom.father}</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
