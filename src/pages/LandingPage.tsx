import HeroSection from '../components/landing/HeroSection';
import ServiceSection from '../components/landing/ServiceSection';
import BeforeAiAfterSection from '../components/landing/BeforeAiAfterSection';
import HowItWorksSection from '../components/landing/HowItWorksSection';
import RequestFormSection from '../components/landing/RequestFormSection';
import DisclaimerFooter from '../components/landing/DisclaimerFooter';
import StickyMobileCta from '../components/landing/StickyMobileCta';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-stone-50 text-stone-900">
      <HeroSection />
      <ServiceSection />
      <BeforeAiAfterSection />
      <HowItWorksSection />
      <RequestFormSection />
      <DisclaimerFooter />
      <StickyMobileCta />
    </div>
  );
}
