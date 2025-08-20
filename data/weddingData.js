// 💒 Wedding Data - Datos centralizados de la boda
export const weddingData = {
  // 👰🤵 Información de la pareja
  couple: {
    bride: "",
    groom: "",
    initials: "Frida",
    quote: "Hoy comienza mi historia… un sueño que florece, un camino nuevo en cada paso, en cada ilusión, en cada latido.",
    mainImage: "/images/noviosEditado1.png",
    sunsetImage: "/images/frida4.jpg"
  },

  // 👨‍👩‍👧‍👦 Información de los padres
  parents: {
    bride: {
      mother: "Vanessa Corpus",
      father: "Carlos Aranda"
    },
    groom: {
      mother: "Karen Corpus",
      father: "Hugo Lizagarra"
    },
    message: "A nuestros queridos padres: gracias por darnos la vida, cuidarnos, guiarnos y prepararnos para este momento tan especial. Su amor y apoyo son la base sobre la que construiremos nuestro hogar."
  },

  // 📅 Información de fecha y evento
  wedding: {
    date: "2025-09-27T18:00:00",
    dayName: "SABADO",
    day: "27",
    month: "SEPTIEMBRE",
    year: "2025",
    title: "Mis XV Años"
  },

  // ⛪ Información de la ceremonia
  ceremony: {
    time: "6:00 p.m",
    name: "Eventos Casablanca",
    address: "11 de Agosto de 1859 907, Leyes de Reforma 3ra Secc, Iztapalapa, 09310 Ciudad de México, CDMX",
    type: "Ceremonia",
    ubiLink: "https://maps.app.goo.gl/DxyKxFY196TicLej8"
  },

  // 🎉 Información de la recepción
  reception: {
    time: "8:00 pm",
    name: "Monarcas Jardin de Eventos",
    address: "Calz de los Monarcas, Mexicali, 21353, BC, MX",
    type: "Recepción",
    ubiLink: "https://maps.app.goo.gl/nEwQ1CXVF7Wa1omEA"
  },

  // ⏰ Timeline del evento
  timeline: [
    {
      id: "ceremonia",
      name: "Ceremonia",
      time: "6:00",
      icon: "🧡", // Anillo de compromiso - símbolo universal del matrimonio
      color: "primary"
    },
    {
      id: "brindis",
      name: "Brindis",
      time: "8:00",
      icon: "🥂", // Copas de champagne - celebración y brindis
      color: "secondary"
    },
    {
      id: "cena",
      name: "Cena",
      time: "9:00",
      icon: "🍽️", // Plato con cubiertos - cena elegante
      color: "primary"
    }
  ],

  // 👗 Código de vestimenta
  dressCode: {
    type: "Formal",
    note: "Se reserva el color blanco para la novia",
    confirmationMessage: "¡Quiero compartir este momento tan esperado contigo! Por favor ayúdanos confirmando tu asistencia"
  },

  // 🎁 Información de regalos
  gifts: {
    type: "Lluvia de sobres",
    message: "Tu presencia es lo más importante, pero si deseas hacernos un obsequio te agradeceríamos que fuera en lluvia de sobre."
  },

  // 📸 Galería de imágenes
  gallery: {
    images: [
      "/images/gallery-1.png",
      "/images/gallery-2.png",
      "/images/couple-sunset.png"
    ]
  },

  // 🏢 Información de la agencia
  agency: {
    name: "Agencia Online",
    message: "Te esperamos"
  },

  // 💬 Mensajes y frases
  messages: {
    timelineQuote: "Hoy florecen mis sueños… cumplo XV años.",
    dateMessage: "¡La cuenta regresiva ha comenzado!",
    countdownTitle: "TAN SÓLO FALTAN"
  },

  // 🎨 Configuraciones de estilo y fondo
  styling: {
    heroSection: {
      backgroundImage: "/images/boda3.png",
      // Opacidad del overlay (0 = transparente, 1 = opaco)
      overlayOpacity: 0.95,
      // Tipo de overlay: 'solid', 'gradient-top', 'gradient-bottom', 'gradient-radial'
      overlayType: "gradient-radial",
      // Color del overlay (usar formato CSS)
      overlayColor: "rgba(255, 255, 255, 1)", // Blanco
      // Color secundario para degradados
      overlayColorSecondary: "rgba(255, 255, 255, 0)", // Transparente
      // Configuración de degradado personalizada
      gradientDirection: "circle at center" // Para radial: 'circle at center', para lineal: 'to bottom'
    },
    dateSection: {
      backgroundImage: "/images/mesaFlores1.jpg",
      overlayOpacity: 0.95,
      overlayType: "gradient-radial",
      overlayColor: "rgba(255, 255, 255, 1)",
      overlayColorSecondary: "rgba(255, 255, 255, 0)",
      gradientDirection: "circle at center"
    },
    ceremonySection: {
      backgroundImage: "/images/boda1.png",
      overlayOpacity: 0.95,
      overlayType: "gradient-radial",
      overlayColor: "rgba(255, 255, 255, 1)",
      overlayColorSecondary: "rgba(255, 255, 255, 0)",
      gradientDirection: "circle at center"
    },
    receptionSection: {
      backgroundImage: "/images/boda1.png",
      overlayOpacity: 0.95,
      overlayType: "gradient-radial",
      overlayColor: "rgba(255, 255, 255, 1)",
      overlayColorSecondary: "rgba(255, 255, 255, 0)",
      gradientDirection: "circle at center"
    },
    timelineSection: {
      backgroundImage: "/images/boda1.png",
      overlayOpacity: 0.95,
      overlayType: "gradient-radial",
      overlayColor: "rgba(255, 255, 255, 1)",
      overlayColorSecondary: "rgba(255, 255, 255, 0)",
      gradientDirection: "circle at center"
    },
    dressCodeSection: {
      backgroundImage: "/images/boda1.png",
      overlayOpacity: 0.95,
      overlayType: "gradient-radial",
      overlayColor: "rgba(255, 255, 255, 1)",
      overlayColorSecondary: "rgba(255, 255, 255, 0)",
      gradientDirection: "circle at center"
    },
    giftsSection: {
      backgroundImage: "/images/boda1.png",
      overlayOpacity: 0.95,
      overlayType: "gradient-radial",
      overlayColor: "rgba(255, 255, 255, 1)",
      overlayColorSecondary: "rgba(255, 255, 255, 0)",
      gradientDirection: "circle at center"
    },
  },

  // 🎵 Configuración de audio
  audio: {
    src: "/audio/musica.mp3",
    fallbacks: [
      "/audio/musica.ogg",
      "/audio/musica.wav"
    ],
    title: "Música de Fondo de Boda",
    startTime: 5,        // 0:13 - Donde empieza la letra
    endTime: 200,          // 1:25 - Final del segmento
    volume: 0.7,          // 60% de volumen
    loop: true,           // Loop en el rango especificado
    preload: "metadata",  // Precargar solo metadatos
    enabled: true,        // Control habilitado
    position: {
      desktop: { bottom: "2rem", right: "2rem" },
      mobile: { bottom: "1rem", right: "1rem" }
    },
    styling: {
      size: {
        desktop: "60px",
        mobile: "50px"
      },
      colors: {
        primary: "var(--secondary)",  // Dorado
        hover: "var(--secondary)/90"
      }
    }
  }
}
