// ⛪ CeremonySection - Sección de información de la ceremonia

import React from "react";
import Image from "next/image";
import { MapPin, Clock } from "lucide-react";
import { Button } from "../ui/button";
import { weddingData } from "../../data/weddingData";
import { useMapNavigation } from "../../hooks/useMapNavigation";
import { getOverlayStyle } from "@/utils/overlay";
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getAnimationConfig } from "@/data/animationConfig";

export default function CeremonySection() {
  const { ceremony, couple, styling } = weddingData;
  const { goToCeremony } = useMapNavigation();
  const { ceremonySection } = styling;

  // Configurar animación de scroll
  const animationConfig = getAnimationConfig("ceremony");
  const { ref: sectionRef, style: animationStyle } = useScrollAnimation(
    animationConfig.options,
    animationConfig.type,
    animationConfig.delay
  );

  return (
    <section
      ref={sectionRef}
      style={{
         /* backgroundImage: `url('/images/campo2.png')`,
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat",  */
        position: "relative",
        zIndex: 5000,
        ...animationStyle,
      }}
      id="ceremony"
      className="py-20"
    >
      {/* Overlay configurable */}
      {/* <div
        style={getOverlayStyle(ceremonySection)}
        className="absolute inset-0 z-0"
      ></div> */}

      <div
        style={{
          // Mantener animación CSS pero optimizada
          animation: "bounce1 1.5s ease 0s 1 normal forwards", // Más rápida
          willChange: "transform, opacity", // Optimización para móviles
          position: "relative",
          zIndex: 4000,
        }}
        className="container bg-slate-300 bg-opacity-60 mx-auto px-4  p-6 rounded-2xl"
      >
        <div
          style={{
            position: "relative",
            zIndex: 4000,
          }}
          className="max-w-4xl mx-auto"
        >
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div className="relative w-full flex justify-center items-center h-96 rounded-2xl shadow-lg overflow-hidden">
              <Image
                src={couple.sunsetImage}
                alt="Pareja al atardecer"
                fill
                className="object-cover "
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>

            <div
              style={{
                position: "relative",
                zIndex: 4000,
              }}
              className="space-y-6"
            >
              <div className="text-center">
                <h2
                  style={{ display: "none" }}
                  className="font-script text-4xl text-secondary mb-4"
                >
                  ITINERARIO
                </h2>
                <h3
                  style={{ display: "none" }}
                  className="font-script text-5xl text-foreground mb-6"
                >
                  {ceremony.type}
                </h3>

                <div
                  style={{
                    position: "relative",
                    zIndex: 4000,
                  }}
                  className="space-y-4"
                >
                   <div className="text-8xl text-secondary font-script mb-4">
            {couple.initials}
          </div>
                  <h4 className="text-2xl font-bold text-foreground">
                    {ceremony.name}
                  </h4>
                  <div className="flex items-center justify-center gap-2">
                    <Clock className="w-6 h-6 text-primary" />
                    <span className="text-2xl font-medium">
                      {ceremony.time}
                    </span>
                  </div>
                  <p className="text-muted-foreground">{ceremony.address}</p>

                  <Button
                    style={{
                      position: "relative",
                      zIndex: 5000, // Asegurar que el botón esté por encima de otros elementos
                    }}
                    onClick={() => window.open(ceremony.ubiLink, "_blank")}
                    className="bg-slate-800 hover:text-black hover:bg-slate-400 text-white rounded-full px-8 py-3"
                  >
                    <MapPin className="w-4 h-4 mr-2" />
                    Ir al mapa
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
