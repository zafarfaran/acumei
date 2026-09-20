import { Routes, Route } from 'react-router-dom';
import ScrollManager from './components/ScrollManager';
import Home from './pages/Home';
import Pricing from './pages/Pricing';
import About from './pages/About';
import CaseStudyPremo from './pages/CaseStudyPremo';
import CaseStudyDentalPractice from './pages/CaseStudyDentalPractice';
import CaseStudyConstruction from './pages/CaseStudyConstruction';
import CaseStudyPlumbing from './pages/CaseStudyPlumbing';
import CaseStudySaas from './pages/CaseStudySaas';
import CaseStudyRestaurant from './pages/CaseStudyRestaurant';
import CaseStudySalon from './pages/CaseStudySalon';
import NotesIndex from './pages/notes/NotesIndex';
import NoteVoicemailDispatchCost from './pages/notes/NoteVoicemailDispatchCost';
import NoteWhenAgentShouldWakeHuman from './pages/notes/NoteWhenAgentShouldWakeHuman';
import NoteBuildOnYourAccounts from './pages/notes/NoteBuildOnYourAccounts';
import NoteOrderingAgentsStockDecisions from './pages/notes/NoteOrderingAgentsStockDecisions';
import NoteFortnightRightUnit from './pages/notes/NoteFortnightRightUnit';
import NoteWhatClientsOwn from './pages/notes/NoteWhatClientsOwn';
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
        <Route path="/case-studies/premo" element={<CaseStudyPremo />} />
        <Route path="/case-studies/dental-practice" element={<CaseStudyDentalPractice />} />
        <Route path="/case-studies/construction" element={<CaseStudyConstruction />} />
        <Route path="/case-studies/plumbing" element={<CaseStudyPlumbing />} />
        <Route path="/case-studies/b2b-saas" element={<CaseStudySaas />} />
        <Route path="/case-studies/restaurant" element={<CaseStudyRestaurant />} />
        <Route path="/case-studies/salon" element={<CaseStudySalon />} />
        <Route path="/notes" element={<NotesIndex />} />
        <Route path="/notes/voicemail-dispatch-cost" element={<NoteVoicemailDispatchCost />} />
        <Route path="/notes/when-to-wake-a-human" element={<NoteWhenAgentShouldWakeHuman />} />
        <Route path="/notes/build-on-your-accounts" element={<NoteBuildOnYourAccounts />} />
        <Route path="/notes/ordering-agents-stock-decisions" element={<NoteOrderingAgentsStockDecisions />} />
        <Route path="/notes/fortnight-right-unit-of-delivery" element={<NoteFortnightRightUnit />} />
        <Route path="/notes/what-clients-actually-own" element={<NoteWhatClientsOwn />} />
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
