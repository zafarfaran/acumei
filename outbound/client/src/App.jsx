import { useState } from 'react';
import Today from './pages/Today.jsx';
import Leads from './pages/Leads.jsx';
import Sequences from './pages/Sequences.jsx';
import Stats from './pages/Stats.jsx';
import Settings from './pages/Settings.jsx';

const PAGES = [
  ['today', 'Today', Today],
  ['leads', 'Leads', Leads],
  ['sequences', 'Sequences', Sequences],
  ['stats', 'Stats', Stats],
  ['settings', 'Settings', Settings],
];

export default function App() {
  const [page, setPage] = useState('today');
  const Active = PAGES.find(([id]) => id === page)[2];

  return (
    <div className="app">
      <aside className="sidebar">
        <div className="brand mono">acumei<span>/outbound</span></div>
        {PAGES.map(([id, label]) => (
          <button
            key={id}
            className={`nav-item${page === id ? ' active' : ''}`}
            onClick={() => setPage(id)}
          >
            {label}
          </button>
        ))}
        <div className="foot mono">local only · nothing leaves this machine except the emails you send</div>
      </aside>
      <main className="main">
        <Active />
      </main>
    </div>
  );
}
