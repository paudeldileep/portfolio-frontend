import { getPortfolioContent } from '@portfolio/api-client';
import SmoothScrollProvider from '@/providers/SmoothScrollProvider';
import Navbar from '@/components/layout/Navbar';
import Footer from '@/components/layout/Footer';
import HeroSection from '@/components/sections/HeroSection';
import AboutSection from '@/components/sections/AboutSection';
import ExperienceSection from '@/components/sections/ExperienceSection';
import SkillsSection from '@/components/sections/SkillsSection';
import CertificationsSection from '@/components/sections/CertificationsSection';
import ContactSection from '@/components/sections/ContactSection';
import AiChatWidget from '@/components/AiChatWidget';

/**
 * Page-level ISR: revalidate every 12 hours.
 * Portfolio content rarely changes; ISR gives us near-static performance
 * with automatic freshness — the best of SSG + SSR.
 */
export const revalidate = 43200; // 12 hours

export default async function HomePage() {
  const result = await getPortfolioContent({ revalidate: 43200 });

  // Fallback: if backend is unavailable during build, render with null data
  // (individual sections handle graceful empty states)
  const content = result.success ? result.data : null;

  return (
    <SmoothScrollProvider>
      <Navbar />

      <main id="main-content" tabIndex={-1} className="outline-none">
        <HeroSection profile={content?.profile ?? null} />
        <AboutSection profile={content?.profile ?? null} />
        <ExperienceSection experience={content?.experience ?? []} />
        <SkillsSection skills={content?.skills ?? null} />
        <CertificationsSection
          certifications={content?.certifications ?? []}
          education={content?.education ?? []}
        />
        <ContactSection />
      </main>

      <Footer />

      {/* Floating AI RAG Chat Assistant */}
      <AiChatWidget />
    </SmoothScrollProvider>
  );
}
