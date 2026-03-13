import Navbar from "@/components/Navbar";
import HeroSection from "@/components/HeroSection";
import ProblemSection from "@/components/ProblemSection";
import HowItWorksSection from "@/components/HowItWorksSection";
import FeaturesSection from "@/components/FeaturesSection";
import DemoSection from "@/components/DemoSection";
import RoiCalculator from "@/components/RoiCalculator";
import PricingSection from "@/components/PricingSection";
import Footer from "@/components/Footer";
import WhyUseSection from "@/components/WhyUseSection";
import TestimonialsSection from "@/components/TestimonialsSection";
import FAQSection from "@/components/FAQSection";
import SupportedFileTypes from "@/components/SupportedFileTypes";
// import HowItWorksQuick from "@/components/HowItWorksQuick";

const Index = () => {
  return (
    <div className="min-h-screen bg-background">
      <main>
      <Navbar />
      <HeroSection />
      <ProblemSection />
      <SupportedFileTypes />
      <FeaturesSection />
      {/* <HowItWorksQuick />  */}
      <HowItWorksSection />
      <DemoSection />
      <WhyUseSection />
      <TestimonialsSection  />
      <RoiCalculator />
      <FAQSection />
      <PricingSection />
      <Footer />
      </main>
    </div>

  );
};

export default Index;
