
import BookWith from "@/components/home/BookWith";
import Checkups from "@/components/home/Checkups";
import HeroSection from "@/components/home/HeroSection";
import LifestylePackages from "@/components/home/LifestylePackages";
import PopularPackage from "@/components/home/PopularPackage";
import PopularTest from "@/components/home/PopularTest";

export default function HomePage() {
  return (
    <>
      <HeroSection />
      <PopularTest />
      <BookWith />
      <PopularPackage />
      <Checkups />
      <LifestylePackages />
      
    </>
  );
}