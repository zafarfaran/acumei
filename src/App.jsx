import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import Industries from './components/Industries';
import HowItWorks from './components/HowItWorks';
import About from './components/About';
import DemoSection from './components/DemoSection';
import Gallery from './components/Gallery';
import Stats from './components/Stats';
import CaseStudies from './components/CaseStudies';
import ROICalculator from './components/ROICalculator';
import Services from './components/Services';
import FAQ from './components/FAQ';
import Book from './components/Book';
import Footer from './components/Footer';

export default function App() {
  const [scrollY, setScrollY] = useState(0);

  useEffect(() => {
    const onScroll = () => setScrollY(window.scrollY);
    window.addEventListener('scroll', onScroll);
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <>
      <Nav />
      <main>
        <Hero scrollY={scrollY} />
        <Marquee />
        <Industries />
        <HowItWorks />
        <ROICalculator />
        <Book />
        <About />
        <DemoSection />
        <Gallery />
        <Stats />
        <CaseStudies />
        <Services />
        <FAQ />
      </main>
      <Footer />
    </>
  );
}
