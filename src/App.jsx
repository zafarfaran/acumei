import useReveal from './hooks/useReveal';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Industries from './components/Industries';
import HowItWorks from './components/HowItWorks';
import ROICalculator from './components/ROICalculator';
import CaseStudies from './components/CaseStudies';
import Notes from './components/Notes';
import Book from './components/Book';
import Footer from './components/Footer';

// About, DemoSection, Stats, Services, FAQ, Testimonials and Marquee are not
// rendered: the redesign has no prototype for them. Their files are still in
// src/components — re-add each one here once it has been redesigned to match.

export default function App() {
  useReveal();

  return (
    <>
      <Nav />
      <main>
        <Hero />
        <hr className="rule" />
        <Industries />
        <hr className="rule" />
        <HowItWorks />
        <hr className="rule" />
        <ROICalculator />
        <hr className="rule" />
        <CaseStudies />
        <hr className="rule" />
        <Notes />
        <Book />
      </main>
      <Footer />
    </>
  );
}
