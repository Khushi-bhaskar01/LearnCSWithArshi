import Hero from "./components/Hero";
import AboutSection from "./components/AboutSection";
import YouTubeSection from "./components/YouTubeSection";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
export default function Home() {
  return (
    <main>
      <Navbar />
      <Hero />
      <AboutSection />
      <YouTubeSection />
      <Footer />
    </main>
  );
}
