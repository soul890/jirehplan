import Header from '../components/layout/Header';
import HeroSection from '../components/landing/HeroSection';
import ServiceSection from '../components/landing/ServiceSection';
import BeforeAiAfterSection from '../components/landing/BeforeAiAfterSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import RequestFormSection from '../components/landing/RequestFormSection';
import DisclaimerFooter from '../components/landing/DisclaimerFooter';
import StickyMobileCta from '../components/landing/StickyMobileCta';

export default function LandingPage() {
  return (
    <div className="min-h-screen overflow-x-hidden bg-background text-on-background">
      <Header />
      <main>
        <HeroSection />
        <ServiceSection />
        <BeforeAiAfterSection />
        <HowItWorksSection />
        <RequestFormSection />
      </main>
      <DisclaimerFooter />
      <StickyMobileCta />
    </div>
  );
}
