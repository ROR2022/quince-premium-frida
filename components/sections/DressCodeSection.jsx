// 👗 DressCodeSection - Sección de código de vestimenta y confirmación

import React, { useEffect, useState } from "react";
import { Phone } from "lucide-react";
import { Button } from "../ui/button";
import { Card, CardContent } from "../ui/card";
import { weddingData } from "../../data/weddingData";
//import { useWhatsApp } from "../../hooks/useWhatsApp";
//import { getOverlayStyle } from '@/utils/overlay'
import { useScrollAnimation } from "@/hooks/useScrollAnimation";
import { getAnimationConfig } from "@/data/animationConfig";
//import { PiCoatHanger } from "react-icons/pi";
import { GiLargeDress } from "react-icons/gi";

import Image from "next/image";

export default function DressCodeSection() {
  const { dressCode } = weddingData;
  //const { confirmAttendance } = useWhatsApp();
  //const { dressCodeSection } = styling;

  const [scrollPosition, setScrollPosition] = useState(window.scrollY);
  const [isVisible, setIsVisible] = useState(false);

  const basicClass = "font-script text-4xl text-secondary";
  const completeClass = "font-script text-4xl text-secondary scale-up-center";

  useEffect(() => {
    const handleScroll = () => {
      //console.log('Scroll position:', window.scrollY);
      setScrollPosition(window.scrollY);
    };

    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  useEffect(() => {
    if (scrollPosition >= 3900 && scrollPosition < 4700) {
      setIsVisible(true);
    }
  }, [scrollPosition]);

  // Configurar animación de scroll
  const animationConfig = getAnimationConfig("dressCode");
  const { ref: sectionRef, style: animationStyle } = useScrollAnimation(
    animationConfig.options,
    animationConfig.type,
    animationConfig.delay
  );

  /**
   * Información del evento
    dayName: "SABADO",
    day: "27",
    month: "SEPTIEMBRE",
    year: "2025",
    title: "Mis XV Años"
   */

    const eventInfo = {
      dayName: "SABADO",
      day: "27",
      month: "SEPTIEMBRE",
      year: "2025",
      title: "Mis XV Años",
      ceremonyTime: "6:00 p.m.",
      date: "27 de septiembre de 2025",
      locationCeremony: "Eventos Casablanca"
    };

  const handleConfirmPapa = () => {
    const confirmationNumber = "5530603612";
    // aqui se crea el mensaje
    const message = `¡Gracias por confirmar tu asistencia a la fiesta de Frida!
        Detalles de la fiesta:
        Fecha: ${eventInfo.date}
        Hora: ${eventInfo.ceremonyTime}
        Ubicación: ${eventInfo.locationCeremony}`;
    // se envia el mensaje via WhatsApp
    const whatsappUrl = `https://wa.me/521${confirmationNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };
  const handleConfirmMama = () => {
    const confirmationNumber = "5554542338";
    // aqui se crea el mensaje
    const message = `¡Gracias por confirmar tu asistencia a la fiesta de Frida!
        Detalles de la fiesta:
        Fecha: ${eventInfo.date}
        Hora: ${eventInfo.ceremonyTime}
        Ubicación: ${eventInfo.locationCeremony}`;
    // se envia el mensaje via WhatsApp
    const whatsappUrl = `https://wa.me/521${confirmationNumber}?text=${encodeURIComponent(
      message
    )}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <section
      ref={sectionRef}
      id="dresscode"
      className="py-20"
      style={{
        /* backgroundImage: `url('/images/campo1.png')`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',  */
        position: "relative",
        zIndex: 5000, // Asegurar que la sección esté por encima de otros elementos
        ...animationStyle,
      }}
    >
      {/* Overlay configurable */}
      {/* <div
        style={getOverlayStyle(dressCodeSection)}
        className="absolute inset-0 z-0"
      ></div> */}

      <div
        style={{
          animation: "bounce1 2s ease 0s 1 infinite",
          backgroundColor: "#C8BFE780",
        }}
        className="container mx-auto px-4  p-6 rounded-2xl"
      >
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <h2 className={isVisible ? completeClass : basicClass}>
            Código de Vestimenta
          </h2>
          <div className="flex gap-4 justify-center items-center">
            <div>
              <Image
                src="/images/icono_traje.png"
                alt="Código de Vestimenta"
                width={30}
                height={50}
                className="mx-auto rounded-lg"
              />
            </div>

            <div className="flex justify-center">
              <GiLargeDress className="w-12 h-12 text-secondary" />
            </div>
          </div>
          <div
            style={{ display: "none" }}
            className="flex justify-center items-center gap-8 mb-8"
          >
            <div className="text-center">
              <div className="w-24 h-32 bg-black rounded-lg mb-4 mx-auto"></div>
              <p className="font-medium">Vestido</p>
            </div>
            <div className="text-center">
              <div className="w-24 h-32 bg-gray-800 rounded-lg mb-4 mx-auto flex items-center justify-center">
                <div className="w-16 h-24 bg-black rounded-sm"></div>
              </div>
              <p className="font-medium">Traje</p>
            </div>
          </div>

          <h3 className="text-3xl font-bold text-foreground">
            {dressCode.type}
          </h3>
          <p className="text-lg text-muted-foreground">{dressCode.note}</p>

          <Card className="max-w-md mx-auto bg-primary/10 border-primary/20">
            <CardContent className="p-8 text-center space-y-4">
              <h3 className="font-script text-3xl text-foreground">
                Confirma tu asistencia
              </h3>
              <p className="text-muted-foreground">
                {dressCode.confirmationMessage}
              </p>
              <Button
                onClick={handleConfirmPapa}
                className="bg-blue-600 hover:bg-blue-700 text-white rounded-full px-8 py-3 w-full"
              >
                <Phone className="w-4 h-4 mr-2" />
                Confirmar con Papá
              </Button>
              <Button
                onClick={handleConfirmMama}
                className="bg-pink-600 hover:bg-pink-700 text-white rounded-full px-8 py-3 w-full"
              >
                <Phone className="w-4 h-4 mr-2" />
                Confirmar con Mamá
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
