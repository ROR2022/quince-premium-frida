"use client"

import { useState } from "react"

//import Navigation from "../components/navigation"
import HeroSection from "../components/sections/HeroSection"
//import ParentsSection from "../components/sections/ParentsSection"
import DateSection from "../components/sections/DateSection"
import CeremonySection from "../components/sections/CeremonySection"
import ReceptionSection from "../components/sections/ReceptionSection"
import TimelineSection from "../components/sections/TimelineSection"
import DressCodeSection from "../components/sections/DressCodeSection"
import GiftsSection from "../components/sections/GiftsSection"
//import GallerySection from "../components/sections/GallerySection"
import AudioPlayer from "../components/AudioPlayer"
import BasicCTA from "../components/sections/BasicCTA"
import InvitationEnvelope from "../components/sections/InvitationEnvelope"
import WelcomeMessage from "../components/sections/InvitationWelcome"
import DecorationElement from "../components/DecorationElement"
import { PremiumGallery } from "@/components/sections/PremiumGallery"

export default function WeddingInvitation() {
  const [isOpenInvitation, setIsOpenInvitation] = useState(false);
  const [isWelcomeMessageVisible, setIsWelcomeMessageVisible] = useState(false);

  const handleOpenInvitation = () => {
    setIsOpenInvitation(true);
    setIsWelcomeMessageVisible(true);
  };

  const handleContinue = () => {
    setIsWelcomeMessageVisible(false);
  };

  if(!isOpenInvitation) {
    return (
      <InvitationEnvelope onOpen={handleOpenInvitation} />
    )
  }

  if (isWelcomeMessageVisible) {
    return <WelcomeMessage onContinue={handleContinue} />
  }

  // Main Invitation Section
  // Color Marfil #FFFFE3
  // Color Verde #89ac76
  return (
    <div 
    style={{
      background: 'linear-gradient(135deg, #eaf4ff 0%, #d6ecff 35%, #c1e3ff 65%, #a9d7ff 100%)',
    }}
    className="min-h-screen">
      {/* <Navigation /> */}
      {/* <DecorationElement /> */}
      <HeroSection />
      {/* <ParentsSection /> */}
      <DateSection />
      <CeremonySection />
      {/* <ReceptionSection /> */}
      <TimelineSection />
      <DressCodeSection />
      <GiftsSection />
      {/* <GallerySection /> */}
      <PremiumGallery />
      <BasicCTA />
      
      {/* 🎵 Reproductor de audio fijo */}
      <AudioPlayer />
    </div>
  )
}
