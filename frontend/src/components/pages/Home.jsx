import Navbar from "../home/Navbar";
import Hero from "../home/Hero";
import PropertyTypes from "../home/PropertyTypes";
import PropertyDeals from "../home/PropertyDeals";
import AboutUs from "../home/AboutUs";
import WhyChooseUs from "../home/WhyChooseUs";
import StatsSection from "../home/StatsSection";
import Testimonials from "../home/Testimonials";
import FeaturedProperties from "../home/FeaturedProperties";
import Newsletter from "../home/Newsletter";
import Footer from "../layout/Footer";

export default function Home() {
  return (
    // ⚡ Master template container frame wraps your elements cleanly without layout shifting
    <div className="min-h-screen bg-white dark:bg-slate-950 transition-colors duration-200 overflow-x-hidden">
      <Navbar />
      <Hero />
      <PropertyTypes />
      <PropertyDeals />
      <AboutUs />
      <WhyChooseUs />
      <StatsSection />
      <Testimonials />
      <FeaturedProperties />
      <Newsletter />
      <Footer />
    </div>
  );
}
