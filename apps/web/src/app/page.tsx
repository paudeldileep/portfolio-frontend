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
import BackendErrorPage from '@/components/BackendErrorPage';

/**
 * Render at request time so an unavailable external API cannot block Vercel's
 * build-time static export.
 */
export const dynamic = 'force-dynamic';

export default async function HomePage() {
  // Read the small portfolio document fresh so Admin Studio edits are visible
  // immediately. The route remains dynamic and is not fetched at build time.
  const result = await getPortfolioContent({
    cache: 'no-store',
  });

  // If backend is unavailable, show error page with retry capability
  if (!result.success) {
    return (
      <SmoothScrollProvider>
        <Navbar />
        <main id="main-content" tabIndex={-1} className="outline-none">
          <BackendErrorPage error={result.error} />
        </main>
        <Footer />
      </SmoothScrollProvider>
    );
  }

  const content = result.data;

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
