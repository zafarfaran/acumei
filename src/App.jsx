import { Routes, Route } from 'react-router-dom';
import ScrollManager from './components/ScrollManager';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import About from './pages/About';
import Careers from './pages/Careers';
import Contact from './pages/Contact';
import FAQ from './pages/FAQ';
import Privacy from './pages/Privacy';
import Terms from './pages/Terms';
import Cookies from './pages/Cookies';
import DataProcessing from './pages/DataProcessing';
import NotFound from './pages/NotFound';

export default function App() {
  return (
    <>
      <ScrollManager />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/pricing" element={<Pricing />} />
        <Route path="/about" element={<About />} />
        <Route path="/careers" element={<Careers />} />
        <Route path="/contact" element={<Contact />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/cookies" element={<Cookies />} />
        <Route path="/data-processing" element={<DataProcessing />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </>
  );
}
