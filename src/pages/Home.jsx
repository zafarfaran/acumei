import { useEffect } from 'react';
import Nav from '../components/Nav';
import Footer from '../components/Footer';
import Stage from '../components/home/Stage';
import Hero from '../components/home/Hero';
import Problem from '../components/home/Problem';
import Services from '../components/home/Services';
import Process from '../components/home/Process';
import Principles from '../components/home/Principles';
import Work from '../components/home/Work';
import Lab from '../components/home/Lab';
import Closing from '../components/home/Closing';
import { STATIC } from '../lib/motion';

export default function Home() {
  useEffect(() => {
    document.title = 'Acumei — AI engineering lab';
  }, []);

  return (
    <div className={`asm asm-home${STATIC ? ' asm-static' : ''}`}>
      <Nav />
      <Stage />
      <main>
        <Hero />
        <Problem />
        <Services />
        <Process />
        <Principles />
        <Work />
        <Lab />
        <Closing />
      </main>
      <Footer />
    </div>
  );
}
