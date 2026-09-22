
import HeroSection from "@/components/home/HeroSection";
import ServicesSection from "@/components/home/ServicesSection";
import HowItWorks from "@/components/home/HowItWorks";
import WhyChooseUs from "@/components/home/WhyChooseUs";
import HomeCollectionSection from "@/components/home/HomeCollectionSection";
import BookingCTA from "@/components/home/BookingCTA";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <HowItWorks />
      <WhyChooseUs />
      <HomeCollectionSection />
      <BookingCTA />
    </>
  );
}