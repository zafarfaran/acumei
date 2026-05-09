# Acumei "Warm Minimal" React Port — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Port the Acumei "Direction A: Warm Minimal" website (Ink & Ochre palette) from a bundled HTML prototype into a clean Vite + React application with all interactive components fully functional.

**Architecture:** Single-page Vite + React app. Plain CSS with custom properties for theming. Self-hosted variable fonts. One component per section, composed in App.jsx. No routing, no CSS framework, no state management library.

**Tech Stack:** Vite 6, React 19, plain CSS, self-hosted Google Fonts (Fraunces, Inter, JetBrains Mono as variable woff2)

**Source prototype:** The original component code lives in `/tmp/acumei_b1f160f8.jsx` (ALanding + all section components) and `/tmp/acumei_shared_widgets.jsx` (AIDemo, ROICalculator, BookingFlow, ServiceTiers). These are the authoritative references for all copy, layout values, colors, and behavior.

---

## Task 1: Scaffold Vite + React project

**Files:**
- Create: `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`

- [ ] **Step 1: Initialize Vite project**

```bash
cd /Users/faran.zafar/hackathon/ai-automate
npm create vite@latest . -- --template react
```

Select defaults if prompted. This creates `package.json`, `vite.config.js`, `index.html`, `src/main.jsx`, `src/App.jsx`, and other boilerplate.

- [ ] **Step 2: Clean up boilerplate**

Delete files we don't need:
```bash
rm -f src/App.css src/index.css src/assets/react.svg public/vite.svg
```

- [ ] **Step 3: Set up minimal App.jsx**

Write `src/App.jsx`:

```jsx
export default function App() {
  return (
    <div id="a-scroll">
      <h1>Acumei — coming together</h1>
    </div>
  );
}
```

- [ ] **Step 4: Set up minimal main.jsx**

Write `src/main.jsx`:

```jsx
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
```

- [ ] **Step 5: Update index.html title**

In `index.html`, change `<title>` to:
```html
<title>Acumei — The AI Brain</title>
```

- [ ] **Step 6: Install dependencies and verify**

```bash
npm install
npm run dev
```

Verify the dev server starts and shows "Acumei — coming together" in the browser at `http://localhost:5173`.

- [ ] **Step 7: Commit**

```bash
git add package.json package-lock.json vite.config.js index.html src/main.jsx src/App.jsx
git commit -m "scaffold: Vite + React project for Acumei website"
```

---

## Task 2: Self-host fonts and set up CSS foundation

**Files:**
- Create: `src/fonts/` (4 woff2 files), `src/styles/fonts.css`, `src/styles/theme.css`, `src/styles/animations.css`, `src/styles/global.css`, `src/index.css`

- [ ] **Step 1: Download variable font files**

```bash
mkdir -p src/fonts

# Inter Variable (latin, weight 100-900)
curl -L -o src/fonts/Inter-Variable.woff2 "https://fonts.gstatic.com/s/inter/v18/UcCO3FwrK3iLTeHuS_nVMrMxCp50SjIw2boKoduKmMEVuLyfAZ9hiJ-Ek-_EeA.woff2"

# Fraunces Variable (latin, weight+opsz+SOFT+WONK)
curl -L -o src/fonts/Fraunces-Variable.woff2 "https://fonts.gstatic.com/s/fraunces/v31/6NUh8FyLNQOQZAnv9bYEvDiIdE9Ea92uemAk_WBq8U_9v0c2Wa0K7iN7hzFUPJH58nk.woff2"

# Fraunces Italic Variable
curl -L -o src/fonts/Fraunces-Italic-Variable.woff2 "https://fonts.gstatic.com/s/fraunces/v31/6NVf8FyLNQOQZAnv9ZwNjucMHVn85Ni7emAe9lKqZTnbB-gzTK0K1ChJdt9vIVYX9G37lvk.woff2"

# JetBrains Mono (latin, regular)
curl -L -o src/fonts/JetBrainsMono-Variable.woff2 "https://fonts.gstatic.com/s/jetbrainsmono/v18/tDbY2o-flEEny0FZhsfKu5WU4zr3E_BX0PnT8RD8yKxTOlOTk6OThhvA.woff2"
```

If any URL fails (Google periodically changes them), download manually from https://fonts.google.com for Fraunces, Inter, and JetBrains Mono — select "Variable" weight, download woff2 only.

- [ ] **Step 2: Create fonts.css**

Write `src/styles/fonts.css`:

```css
/* Inter — variable weight */
@font-face {
  font-family: 'Inter';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('../fonts/Inter-Variable.woff2') format('woff2');
}

/* Fraunces — variable weight, optical size, SOFT, WONK */
@font-face {
  font-family: 'Fraunces';
  font-style: normal;
  font-weight: 100 900;
  font-display: swap;
  src: url('../fonts/Fraunces-Variable.woff2') format('woff2');
}

@font-face {
  font-family: 'Fraunces';
  font-style: italic;
  font-weight: 100 900;
  font-display: swap;
  src: url('../fonts/Fraunces-Italic-Variable.woff2') format('woff2');
}

/* JetBrains Mono — variable weight */
@font-face {
  font-family: 'JetBrains Mono';
  font-style: normal;
  font-weight: 100 800;
  font-display: swap;
  src: url('../fonts/JetBrainsMono-Variable.woff2') format('woff2');
}
```

- [ ] **Step 3: Create theme.css**

Write `src/styles/theme.css`:

```css
:root {
  --bg: #0e0e10;
  --bg-alt: #16161a;
  --ink: #f3eee2;
  --ink-soft: #b9b3a4;
  --muted: #7a746a;
  --border: #2a2a2e;
  --accent: #e8a04b;
  --accent-soft: #3a2e1c;
  --surface: #18181c;
}
```

- [ ] **Step 4: Create animations.css**

Write `src/styles/animations.css`:

```css
/* Marquee scroll */
@keyframes a-marq {
  from { transform: translateX(0); }
  to { transform: translateX(-50%); }
}

/* Pulsing dot */
@keyframes a-pulse {
  0%, 100% { opacity: 1; transform: scale(1); }
  50% { opacity: 0.4; transform: scale(0.8); }
}

/* Fade-up reveal */
@keyframes a-reveal {
  from { opacity: 0; transform: translateY(8px); }
  to { opacity: 1; transform: translateY(0); }
}

/* CTA arrow bounce */
@keyframes a-arrow {
  0%, 100% { transform: translateX(0); }
  50% { transform: translateX(6px); }
}

/* Brain pulse rings */
@keyframes a-brain-pulse {
  0% { transform: scale(0.5); opacity: 0.7; }
  80% { opacity: 0; }
  100% { transform: scale(3.4); opacity: 0; }
}

/* Brain orbit rings */
@keyframes a-brain-orbit {
  from { transform: rotate(0deg); }
  to { transform: rotate(360deg); }
}

@keyframes a-brain-orbit-rev {
  from { transform: rotate(360deg); }
  to { transform: rotate(0deg); }
}

/* Brain core breathing */
@keyframes a-brain-breathe {
  0%, 100% { transform: scale(1); }
  50% { transform: scale(1.18); }
}

/* AI Demo message fade-in */
@keyframes demoFadeIn {
  from { opacity: 0; transform: translateY(4px); }
  to { opacity: 1; transform: translateY(0); }
}

/* Typing indicator blink */
@keyframes acumeiBlink {
  0%, 100% { opacity: 1; }
  50% { opacity: 0.2; }
}
```

- [ ] **Step 5: Create global.css**

Write `src/styles/global.css`:

```css
*, *::before, *::after {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
}

body {
  background: var(--bg);
  color: var(--ink);
  font-family: 'Inter', system-ui, sans-serif;
  font-size: 16px;
  line-height: 1.55;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
}

#a-scroll {
  scrollbar-width: thin;
}

.display {
  font-family: 'Fraunces', 'Times New Roman', serif;
  font-weight: 380;
  letter-spacing: -0.022em;
  font-variation-settings: "opsz" 144, "SOFT" 50;
}

.display-ital {
  font-family: 'Fraunces', serif;
  font-style: italic;
  font-weight: 380;
  font-variation-settings: "opsz" 144, "SOFT" 100;
}

.mono {
  font-family: 'JetBrains Mono', ui-monospace, monospace;
}

a {
  color: inherit;
  text-decoration: none;
  cursor: pointer;
}

/* Marquee */
.marquee {
  display: flex;
  gap: 64px;
  animation: a-marq 40s linear infinite;
  white-space: nowrap;
}

/* Grain overlay */
.grain {
  position: absolute;
  inset: 0;
  pointer-events: none;
  opacity: 0.06;
  mix-blend-mode: multiply;
  background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
}

/* Pulse dot */
.pulse-dot {
  animation: a-pulse 2s ease-in-out infinite;
}

/* Reveal animation */
.reveal {
  animation: a-reveal 0.8s ease-out both;
}

/* Arrow loop */
.arrow-loop {
  animation: a-arrow 2.4s ease-in-out infinite;
}

/* Play button hover */
.play-btn {
  transition: transform 0.3s;
}
.play-card:hover .play-btn {
  transform: scale(1.1);
}
```

- [ ] **Step 6: Create index.css that imports all styles**

Write `src/index.css`:

```css
@import './styles/fonts.css';
@import './styles/theme.css';
@import './styles/animations.css';
@import './styles/global.css';
```

- [ ] **Step 7: Import index.css in main.jsx**

Update `src/main.jsx` — add at top:

```jsx
import './index.css';
```

- [ ] **Step 8: Verify fonts load**

Update `src/App.jsx` temporarily to test all three fonts:

```jsx
export default function App() {
  return (
    <div style={{ padding: 56 }}>
      <h1 className="display" style={{ fontSize: 60, color: 'var(--ink)' }}>Acumei Display</h1>
      <p style={{ color: 'var(--ink-soft)', marginTop: 16 }}>Inter body text — the quick brown fox.</p>
      <code className="mono" style={{ color: 'var(--accent)', marginTop: 16, display: 'block' }}>JetBrains Mono · 01234</code>
    </div>
  );
}
```

Check in browser: Fraunces should render with serif/old-style feel, Inter should be clean sans-serif, JetBrains Mono should be monospaced. If a font doesn't load, check the woff2 file exists and the path in fonts.css is correct.

- [ ] **Step 9: Commit**

```bash
git add src/fonts/ src/styles/ src/index.css src/main.jsx src/App.jsx
git commit -m "feat: add self-hosted fonts and CSS foundation (theme, animations, global styles)"
```

---

## Task 3: SectionLabel + Nav + Footer (structural shell)

**Files:**
- Create: `src/components/SectionLabel.jsx`, `src/components/Nav.jsx`, `src/components/Footer.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create SectionLabel component**

Write `src/components/SectionLabel.jsx`:

```jsx
export default function SectionLabel({ n, label }) {
  return (
    <div className="mono" style={{
      fontSize: 11,
      letterSpacing: '0.18em',
      textTransform: 'uppercase',
      marginBottom: 40,
      display: 'flex',
      gap: 16,
    }}>
      <span style={{ color: 'var(--accent)' }}>{n}</span>
      <span style={{ color: 'var(--muted)' }}>—</span>
      <span style={{ color: 'var(--muted)' }}>{label}</span>
    </div>
  );
}
```

Note: The Book section uses custom colors (accent for number, light muted for text). We'll handle that with optional props when we build that section.

- [ ] **Step 2: Create Nav component**

Write `src/components/Nav.jsx`:

```jsx
export default function Nav() {
  return (
    <nav style={{
      position: 'sticky',
      top: 0,
      zIndex: 50,
      background: 'var(--bg)' + 'd9',
      backdropFilter: 'blur(12px)',
      borderBottom: '1px solid var(--border)',
      padding: '16px 56px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
        <svg width="22" height="22" viewBox="0 0 24 24" fill="none">
          <circle cx="12" cy="12" r="10" stroke="var(--ink)" strokeWidth="1.5" />
          <circle cx="12" cy="12" r="3" fill="var(--accent)" />
          <path d="M12 2 L12 22 M2 12 L22 12" stroke="var(--ink)" strokeWidth="0.5" opacity="0.3" />
        </svg>
        <span className="display" style={{ fontSize: 26, letterSpacing: '-0.01em' }}>Acumei</span>
      </div>
      <div style={{ display: 'flex', gap: 32, fontSize: 14, color: 'var(--ink-soft)' }}>
        <a href="#how">The AI Brain</a>
        <a href="#how">How it works</a>
        <a href="#customers">Customers</a>
        <a href="#services">Pricing</a>
        <a href="#faq">FAQ</a>
      </div>
      <button style={{
        padding: '10px 18px',
        background: 'var(--ink)',
        color: 'var(--bg)',
        border: 'none',
        borderRadius: 999,
        fontSize: 13,
        cursor: 'pointer',
        fontFamily: 'inherit',
      }}>Book a call →</button>
    </nav>
  );
}
```

- [ ] **Step 3: Create Footer component**

Write `src/components/Footer.jsx`:

```jsx
export default function Footer() {
  return (
    <footer style={{
      padding: '40px 56px',
      background: 'var(--ink)',
      color: 'rgba(14, 14, 16, 0.5)',
      borderTop: '1px solid rgba(14, 14, 16, 0.1)',
      display: 'flex',
      justifyContent: 'space-between',
      fontSize: 12,
    }}>
      <div className="mono" style={{ letterSpacing: '0.1em' }}>
        © 2026 ACUMEI LTD · REGISTERED IN ENGLAND &amp; WALES · LONDON
      </div>
      <div style={{ display: 'flex', gap: 24 }}>
        <span>hello@acumei.co.uk</span>
        <span>LinkedIn</span>
        <span>Privacy</span>
      </div>
    </footer>
  );
}
```

- [ ] **Step 4: Wire into App.jsx**

Write `src/App.jsx`:

```jsx
import Nav from './components/Nav';
import Footer from './components/Footer';

export default function App() {
  return (
    <>
      <Nav />
      <main>
        {/* Sections will be added here */}
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 5: Verify in browser**

Check: sticky nav with blurred bg, logo + links + CTA button. Footer at bottom with cream bg and dark text. Fonts should be correct.

- [ ] **Step 6: Commit**

```bash
git add src/components/SectionLabel.jsx src/components/Nav.jsx src/components/Footer.jsx src/App.jsx
git commit -m "feat: add Nav, Footer, and SectionLabel components"
```

---

## Task 4: BrainGraphic + Hero section

**Files:**
- Create: `src/components/BrainGraphic.jsx`, `src/components/Hero.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create BrainGraphic component**

Write `src/components/BrainGraphic.jsx`:

```jsx
const SYSTEMS = [
  { angle: -90, label: 'CRM', r: 38 },
  { angle: -35, label: 'Diary', r: 42 },
  { angle: 18, label: 'POS', r: 38 },
  { angle: 70, label: 'SMS', r: 40 },
  { angle: 130, label: 'Email', r: 38 },
  { angle: 175, label: 'Stock', r: 42 },
  { angle: 225, label: 'Reviews', r: 40 },
  { angle: 280, label: 'Pay', r: 38 },
];

const cx = 50;
const cy = 50;

function toXY(deg, r) {
  return [
    cx + Math.cos((deg * Math.PI) / 180) * r,
    cy + Math.sin((deg * Math.PI) / 180) * r,
  ];
}

export default function BrainGraphic({ size = 380 }) {
  return (
    <svg viewBox="0 0 100 100" width={size} height={size} style={{ display: 'block' }}>
      <defs>
        <radialGradient id="brainGlow" cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor="var(--accent)" stopOpacity="0.35" />
          <stop offset="60%" stopColor="var(--accent)" stopOpacity="0.05" />
          <stop offset="100%" stopColor="var(--accent)" stopOpacity="0" />
        </radialGradient>
        <filter id="brainBlur" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="0.4" />
        </filter>
      </defs>

      {/* Soft accent halo */}
      <circle cx={cx} cy={cy} r="48" fill="url(#brainGlow)" />

      {/* Pulse rings */}
      {[0, 1, 2].map((i) => (
        <circle
          key={i}
          cx={cx}
          cy={cy}
          r="14"
          fill="none"
          stroke="var(--accent)"
          strokeWidth="0.4"
          opacity="0.6"
          style={{
            transformOrigin: '50% 50%',
            animation: `a-brain-pulse 3.6s ease-out ${i * 1.2}s infinite`,
          }}
        />
      ))}

      {/* Outer rotating ring */}
      <g style={{ transformOrigin: '50% 50%', animation: 'a-brain-orbit 60s linear infinite' }}>
        <circle cx={cx} cy={cy} r="44" fill="none" stroke="var(--ink)" strokeWidth="0.2" opacity="0.3" strokeDasharray="0.5 2" />
      </g>

      {/* Mid rotating ring (reverse) */}
      <g style={{ transformOrigin: '50% 50%', animation: 'a-brain-orbit-rev 40s linear infinite' }}>
        <circle cx={cx} cy={cy} r="32" fill="none" stroke="var(--ink)" strokeWidth="0.25" opacity="0.45" strokeDasharray="2 1.2" />
      </g>

      {/* Connector lines + system nodes */}
      {SYSTEMS.map((s, i) => {
        const [x, y] = toXY(s.angle, s.r);
        return (
          <g key={s.label}>
            <line x1={cx} y1={cy} x2={x} y2={y} stroke="var(--ink)" strokeWidth="0.25" opacity="0.4" />
            <circle r="0.9" fill="var(--accent)">
              <animateMotion
                dur={`${3 + (i % 3) * 0.7}s`}
                repeatCount="indefinite"
                begin={`${i * 0.35}s`}
                path={`M ${cx} ${cy} L ${x} ${y}`}
              />
              <animate
                attributeName="opacity"
                values="0;1;1;0"
                dur={`${3 + (i % 3) * 0.7}s`}
                repeatCount="indefinite"
                begin={`${i * 0.35}s`}
              />
            </circle>
            <circle cx={x} cy={y} r="3.4" fill="var(--surface)" stroke="var(--ink)" strokeWidth="0.4" />
            <circle cx={x} cy={y} r="1.2" fill="var(--accent)" opacity="0.7" />
            <text
              x={x}
              y={y + (s.angle > 0 && s.angle < 180 ? 6 : -4.5)}
              textAnchor="middle"
              fontSize="2.2"
              fill="var(--ink-soft)"
              fontFamily="JetBrains Mono"
            >
              {s.label}
            </text>
          </g>
        );
      })}

      {/* Breathing core */}
      <g style={{ transformOrigin: '50% 50%', animation: 'a-brain-breathe 4s ease-in-out infinite' }} filter="url(#brainBlur)">
        <circle cx={cx} cy={cy} r="11" fill="var(--accent)" opacity="0.18" />
      </g>
      <circle cx={cx} cy={cy} r="8" fill="var(--accent)" stroke="var(--ink)" strokeWidth="0.5" />
      <text x={cx} y={cy - 0.6} textAnchor="middle" fontSize="2.6" fill="var(--bg)" fontFamily="JetBrains Mono" letterSpacing="0.15em">
        AI
      </text>
      <text x={cx} y={cy + 2.6} textAnchor="middle" fontSize="2.8" fill="var(--bg)" fontFamily="Fraunces" fontStyle="italic">
        brain
      </text>
    </svg>
  );
}
```

- [ ] **Step 2: Create Hero component**

Write `src/components/Hero.jsx`:

```jsx
import BrainGraphic from './BrainGraphic';

const LIVE_ITEMS = [
  { time: '04:47', label: 'Emergency triage · Bristol', status: 'dispatched', accent: true },
  { time: '06:00', label: 'Salon rebookings · Soho', status: '23 sent · 7 booked', accent: false },
  { time: '09:12', label: 'Stock reconciled · Leeds', status: 'reconciled', accent: false },
  { time: '14:30', label: 'Quote drafted · Manchester', status: '£8,420 · sent', accent: true },
];

const TAGS = [
  'Stops calls slipping',
  'Books appointments back in',
  'Chases late invoices',
  'Triages emergencies',
  'Writes the awkward emails',
  'Gives you your evenings back',
];

export default function Hero({ scrollY = 0 }) {
  return (
    <div style={{ position: 'relative', padding: '110px 56px 90px', overflow: 'hidden' }}>
      <div className="grain" />

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1.25fr 1fr',
        gap: 64,
        alignItems: 'end',
        position: 'relative',
      }}>
        {/* Left column */}
        <div>
          <div className="mono" style={{
            fontSize: 12,
            letterSpacing: '0.18em',
            color: 'var(--accent)',
            marginBottom: 32,
            textTransform: 'uppercase',
          }}>
            <span
              className="pulse-dot"
              style={{
                display: 'inline-block',
                width: 6,
                height: 6,
                background: 'var(--accent)',
                borderRadius: '50%',
                marginRight: 10,
                verticalAlign: 'middle',
              }}
            />
            AI for British businesses · London
          </div>

          <h1 className="display" style={{
            fontSize: 104,
            lineHeight: 0.93,
            margin: 0,
            letterSpacing: '-0.035em',
          }}>
            The <span className="display-ital" style={{ color: 'var(--accent)' }}>AI Brain</span>
            <br />your business
            <br />was promised.
          </h1>

          <p style={{
            fontSize: 21,
            color: 'var(--ink-soft)',
            lineHeight: 1.5,
            maxWidth: 580,
            marginTop: 36,
          }}>
            Acumei builds the <strong style={{ color: 'var(--ink)', fontWeight: 500 }}>AI Brain</strong> of
            growing British businesses — a quietly brilliant assistant that picks up the phone at 4am, drafts
            the awkward follow-up email, sorts tomorrow's diary and reorders the stock before you even notice
            it's running low. So you can stop firefighting and start running the business you set out to build.
          </p>

          <div style={{ display: 'flex', gap: 8, marginTop: 28, flexWrap: 'wrap' }}>
            {TAGS.map((tag) => (
              <span key={tag} className="mono" style={{
                fontSize: 11,
                padding: '6px 12px',
                border: '1px solid var(--border)',
                borderRadius: 999,
                color: 'var(--ink-soft)',
                letterSpacing: '0.05em',
                background: 'var(--surface)',
              }}>
                {tag}
              </span>
            ))}
          </div>

          <div style={{ display: 'flex', gap: 14, marginTop: 40 }}>
            <button style={{
              padding: '16px 26px',
              background: 'var(--ink)',
              color: 'var(--bg)',
              border: 'none',
              borderRadius: 999,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
              display: 'flex',
              alignItems: 'center',
              gap: 8,
            }}>
              Book a 30-minute discovery call
              <span className="arrow-loop" style={{ display: 'inline-block' }}>→</span>
            </button>
            <button style={{
              padding: '16px 26px',
              background: 'transparent',
              color: 'var(--ink)',
              border: '1px solid var(--border)',
              borderRadius: 999,
              fontSize: 14,
              cursor: 'pointer',
              fontFamily: 'inherit',
            }}>
              See live examples
            </button>
          </div>
        </div>

        {/* Right column */}
        <div>
          <div style={{
            display: 'flex',
            justifyContent: 'center',
            marginBottom: 20,
            padding: 16,
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            position: 'relative',
          }}>
            <BrainGraphic size={300} />
            <div className="mono" style={{
              position: 'absolute',
              bottom: 12,
              left: 16,
              fontSize: 9,
              letterSpacing: '0.18em',
              color: 'var(--muted)',
            }}>
              FIG.01 · THE AI BRAIN — ALWAYS ON, ALWAYS QUIET
            </div>
          </div>

          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            padding: 18,
            transform: `translateY(${Math.max(-32, -scrollY * 0.04)}px)`,
          }}>
            <div style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              marginBottom: 12,
            }}>
              <span className="mono" style={{
                fontSize: 10,
                letterSpacing: '0.18em',
                color: 'var(--muted)',
                textTransform: 'uppercase',
              }}>
                Today, across the network
              </span>
              <span style={{ display: 'flex', alignItems: 'center', gap: 6, fontSize: 11, color: 'var(--accent)' }}>
                <span className="pulse-dot" style={{
                  width: 6,
                  height: 6,
                  background: 'var(--accent)',
                  borderRadius: '50%',
                }} />
                <span className="mono" style={{ letterSpacing: '0.1em' }}>LIVE</span>
              </span>
            </div>

            {LIVE_ITEMS.map((it, i) => (
              <div key={i} className="reveal" style={{
                display: 'grid',
                gridTemplateColumns: '46px 1fr auto',
                gap: 14,
                padding: '8px 0',
                borderTop: i === 0 ? 'none' : '1px solid var(--border)',
                alignItems: 'center',
                animationDelay: `${i * 80}ms`,
              }}>
                <span className="mono" style={{ fontSize: 11, color: 'var(--muted)' }}>{it.time}</span>
                <span style={{ fontSize: 12 }}>{it.label}</span>
                <span className="mono" style={{ fontSize: 10, color: it.accent ? 'var(--accent)' : 'var(--ink)' }}>
                  {it.status}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Industry row */}
      <div style={{
        display: 'flex',
        alignItems: 'center',
        gap: 32,
        marginTop: 88,
        color: 'var(--muted)',
        fontSize: 12,
        flexWrap: 'wrap',
      }}>
        <span className="mono" style={{ letterSpacing: '0.1em' }}>NOW SERVING:</span>
        <span>Plumbing &amp; heating</span><span>·</span>
        <span>Hospitality</span><span>·</span>
        <span>Salons &amp; clinics</span><span>·</span>
        <span>Independent retail</span><span>·</span>
        <span>Trades</span><span>·</span>
        <span>Solicitors &amp; accountants</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 3: Wire Hero into App.jsx with scroll tracking**

Update `src/App.jsx`:

```jsx
import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
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
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 4: Verify in browser**

Check: Hero renders with large headline, animated brain SVG (rings rotating, signals traveling, core breathing), live feed card, tag chips, two CTA buttons with arrow animation, grain overlay, industries row. The live feed card should shift slightly on scroll.

- [ ] **Step 5: Commit**

```bash
git add src/components/BrainGraphic.jsx src/components/Hero.jsx src/App.jsx
git commit -m "feat: add Hero section with animated BrainGraphic SVG and live feed"
```

---

## Task 5: Marquee + HowItWorks

**Files:**
- Create: `src/components/Marquee.jsx`, `src/components/HowItWorks.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create Marquee component**

Write `src/components/Marquee.jsx`:

```jsx
const ITEMS = [
  'Picks up the phone at 4am',
  'Books in lapsed clients',
  'Drafts your quotes',
  'Reorders your stock',
  'Chases late invoices',
  "Sorts tomorrow\u2019s diary",
  'Writes the follow-up email',
  'Triages emergencies',
  'Sends the rebooking nudge',
  'Reconciles the till',
  'Gives you your evenings back',
];

export default function Marquee() {
  const all = [...ITEMS, ...ITEMS];
  return (
    <div style={{
      borderTop: '1px solid var(--border)',
      borderBottom: '1px solid var(--border)',
      padding: '20px 0',
      overflow: 'hidden',
      background: 'var(--bg-alt)',
    }}>
      <div className="marquee">
        {all.map((it, i) => (
          <span key={i} className="display" style={{
            fontSize: 32,
            color: 'var(--ink)',
            opacity: i % 2 ? 0.4 : 1,
          }}>
            {it}{' '}
            <span style={{ color: 'var(--accent)', marginLeft: 64 }}>✱</span>
          </span>
        ))}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create HowItWorks component**

Write `src/components/HowItWorks.jsx`:

```jsx
import SectionLabel from './SectionLabel';

const STEPS = [
  { n: '01', t: 'Talk', d: 'A 30-minute discovery call. Show us the workflow that hurts. We tell you whether AI can fix it — honestly.', when: 'Day 1' },
  { n: '02', t: 'Map', d: "Within 48 hours, a written brief: top three opportunities, rough scope, what we'd build first.", when: 'Day 2' },
  { n: '03', t: 'Build', d: 'We write the code. Real integrations with your actual tools. You review as it comes together.', when: 'Days 3–10' },
  { n: '04', t: 'Hand over', d: 'Live system. Your code, your prompts, your accounts. Optional retainer if you want us on call.', when: 'Day 14' },
];

export default function HowItWorks() {
  return (
    <section style={{ padding: '120px 56px', borderBottom: '1px solid var(--border)' }}>
      <SectionLabel n="01" label="How we work" />
      <h2 className="display" style={{
        fontSize: 68,
        margin: 0,
        letterSpacing: '-0.025em',
        maxWidth: 940,
        lineHeight: 1.05,
      }}>
        From "we have a problem" to a quieter business — in a fortnight.
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 32,
        marginTop: 80,
      }}>
        {STEPS.map((s) => (
          <div key={s.n} style={{ borderTop: '1px solid var(--ink)', paddingTop: 20 }}>
            <div className="mono" style={{
              fontSize: 12,
              color: 'var(--muted)',
              letterSpacing: '0.1em',
              marginBottom: 6,
            }}>
              {s.when}
            </div>
            <div className="display" style={{
              fontSize: 56,
              color: 'var(--accent)',
              marginBottom: 8,
              letterSpacing: '-0.03em',
            }}>
              {s.n}
            </div>
            <div style={{ fontSize: 22, marginBottom: 12, fontWeight: 500 }}>{s.t}</div>
            <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.55 }}>{s.d}</div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to App.jsx**

In `src/App.jsx`, add imports and components inside `<main>` after `<Hero>`:

```jsx
import Marquee from './components/Marquee';
import HowItWorks from './components/HowItWorks';
```

```jsx
<Hero scrollY={scrollY} />
<Marquee />
<HowItWorks />
```

- [ ] **Step 4: Verify in browser**

Check: Marquee scrolls continuously left with alternating opacity items and ochre star separators. HowItWorks shows 4-column grid with timeline labels, large step numbers, titles, and descriptions.

- [ ] **Step 5: Commit**

```bash
git add src/components/Marquee.jsx src/components/HowItWorks.jsx src/App.jsx
git commit -m "feat: add Marquee and HowItWorks sections"
```

---

## Task 6: AIDemo + DemoSection

**Files:**
- Create: `src/components/AIDemo.jsx`, `src/components/DemoSection.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create AIDemo component**

Write `src/components/AIDemo.jsx`:

```jsx
import { useState, useEffect } from 'react';

const SCENARIOS = [
  {
    label: 'Plumbing dispatch',
    industry: 'Trades',
    messages: [
      { role: 'system', text: 'New voicemail received: 04:47' },
      { role: 'transcript', text: '"Hi, this is Janet on Cedar Road, my boiler is leaking quite badly into the kitchen, please ring me back as soon as you can."' },
      { role: 'agent', text: 'Triaged: emergency · water damage risk · returning customer (last visit Mar 2024)' },
      { role: 'agent', text: 'Drafted SMS to Tom (on-call): "Emergency at 14 Cedar Rd — Janet R., active leak. ETA?"' },
      { role: 'agent', text: 'Held diary slot 08:00 — auto-confirmed when Tom accepted.' },
      { role: 'result', text: '14 seconds. Phone never rang.' },
    ],
  },
  {
    label: 'Restaurant ordering',
    industry: 'Hospitality',
    messages: [
      { role: 'system', text: 'Sunday 9:12 PM · POS sync complete' },
      { role: 'agent', text: 'Reviewed last 30 days of sales against current stock.' },
      { role: 'agent', text: 'Flagged: ribeye (−31% vs forecast), basil (waste +24%), house red (out by Wed).' },
      { role: 'agent', text: 'Drafted order for Brakes: ribeye −4kg, basil −2 cases, +6 cases house red.' },
      { role: 'agent', text: 'Sent to chef for approval — one tap to send.' },
      { role: 'result', text: '£270 in projected food waste avoided this week.' },
    ],
  },
  {
    label: 'Salon rebooking',
    industry: 'High street',
    messages: [
      { role: 'system', text: 'Daily run · 6:00 AM' },
      { role: 'agent', text: 'Identified 23 clients overdue for rebooking (>8 weeks since last cut).' },
      { role: 'agent', text: 'Personalised SMS drafted for each — referencing stylist + service.' },
      { role: 'agent', text: 'Sent to 23 clients. Held back 2 with prior complaints for review.' },
      { role: 'result', text: '7 rebookings by 11:00. No team time spent.' },
    ],
  },
];

const ROLE_PREFIX = {
  system: '◦',
  transcript: '\u201c',
  agent: '▸',
  result: '✓',
};

export default function AIDemo() {
  const [scenarioIdx, setScenarioIdx] = useState(0);
  const [visibleCount, setVisibleCount] = useState(1);
  const scenario = SCENARIOS[scenarioIdx];

  useEffect(() => {
    setVisibleCount(1);
    const interval = setInterval(() => {
      setVisibleCount((c) => {
        if (c >= scenario.messages.length) {
          clearInterval(interval);
          return c;
        }
        return c + 1;
      });
    }, 1100);
    return () => clearInterval(interval);
  }, [scenarioIdx]);

  const roleStyle = (role) => {
    switch (role) {
      case 'system':
        return { color: 'var(--muted)', fontFamily: 'ui-monospace, "SF Mono", monospace', fontSize: 12, opacity: 0.7 };
      case 'transcript':
        return { color: 'var(--ink)', fontStyle: 'italic', fontSize: 14, opacity: 0.9, paddingLeft: 16, borderLeft: '2px solid var(--border)' };
      case 'agent':
        return { color: 'var(--ink)', fontSize: 14 };
      case 'result':
        return { color: 'var(--accent)', fontSize: 13, fontWeight: 500, letterSpacing: '0.02em', borderTop: '1px dashed var(--border)', paddingTop: 12, marginTop: 8 };
      default:
        return {};
    }
  };

  return (
    <div style={{ background: 'var(--surface)', border: '1px solid var(--border)', overflow: 'hidden' }}>
      {/* Tabs */}
      <div style={{ display: 'flex', borderBottom: '1px solid var(--border)' }}>
        {SCENARIOS.map((s, i) => (
          <button
            key={s.label}
            onClick={() => setScenarioIdx(i)}
            style={{
              flex: 1,
              padding: '14px 16px',
              background: i === scenarioIdx ? '#0f0f0f' : 'transparent',
              border: 'none',
              borderRight: i < SCENARIOS.length - 1 ? '1px solid var(--border)' : 'none',
              borderBottom: i === scenarioIdx ? '2px solid var(--accent)' : 'none',
              color: i === scenarioIdx ? 'var(--ink)' : 'var(--muted)',
              cursor: 'pointer',
              fontFamily: 'inherit',
              fontSize: 13,
              textAlign: 'left',
              marginBottom: -1,
              transition: 'color 0.2s',
            }}
          >
            <div style={{ fontSize: 10, letterSpacing: '0.15em', textTransform: 'uppercase', opacity: 0.6, marginBottom: 2 }}>
              {s.industry}
            </div>
            <div>{s.label}</div>
          </button>
        ))}
      </div>

      {/* Console */}
      <div style={{ padding: 24, minHeight: 320, fontFamily: 'inherit' }}>
        {scenario.messages.slice(0, visibleCount).map((m, i) => (
          <div key={i} style={{
            display: 'flex',
            gap: 12,
            marginBottom: 14,
            animation: 'demoFadeIn 0.4s ease-out',
          }}>
            <span style={{ color: 'var(--muted)', fontFamily: 'monospace', fontSize: 12, marginTop: 2, minWidth: 14 }}>
              {ROLE_PREFIX[m.role]}
            </span>
            <span style={{ ...roleStyle(m.role), flex: 1, lineHeight: 1.5 }}>
              {m.text}
            </span>
          </div>
        ))}
        {visibleCount < scenario.messages.length && (
          <div style={{ display: 'flex', gap: 4, marginTop: 8, marginLeft: 26 }}>
            <span style={{
              width: 6,
              height: 6,
              background: 'var(--accent)',
              borderRadius: '50%',
              animation: 'acumeiBlink 1s infinite',
            }} />
          </div>
        )}
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create DemoSection component**

Write `src/components/DemoSection.jsx`:

```jsx
import SectionLabel from './SectionLabel';
import AIDemo from './AIDemo';

export default function DemoSection() {
  return (
    <section style={{
      padding: '120px 56px',
      background: 'var(--bg-alt)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionLabel n="02" label="A morning, handled" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.1fr',
        gap: 80,
        alignItems: 'center',
      }}>
        <div>
          <h2 className="display" style={{
            fontSize: 60,
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
          }}>
            What an <span className="display-ital" style={{ color: 'var(--accent)' }}>AI Brain</span> handles before you finish your coffee.
          </h2>
          <p style={{
            fontSize: 17,
            color: 'var(--ink-soft)',
            lineHeight: 1.6,
            marginTop: 24,
            maxWidth: 480,
          }}>
            A real morning, condensed. The Brain catches the missed calls, drafts the replies, sorts the
            diary and queues the awkward follow-ups. You wake up to a tidy list of things to approve — not
            a hundred things to chase.
          </p>
          <ul style={{ listStyle: 'none', padding: 0, marginTop: 32, fontSize: 14, color: 'var(--ink)' }}>
            {[
              'You stay in charge — nothing risky goes out without your nod',
              'Tricky calls always come to a human, never to a dead end',
              'You can see and undo anything the Brain did, any time',
            ].map((x) => (
              <li key={x} style={{
                display: 'flex',
                gap: 12,
                padding: '10px 0',
                borderTop: '1px solid var(--border)',
              }}>
                <span style={{ color: 'var(--accent)' }}>→</span>{x}
              </li>
            ))}
          </ul>
        </div>
        <AIDemo />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to App.jsx**

Import and add after HowItWorks:

```jsx
import DemoSection from './components/DemoSection';
```

```jsx
<HowItWorks />
<DemoSection />
```

- [ ] **Step 4: Verify in browser**

Check: Demo section has two columns. Left has headline, description, and bullet list. Right has tabbed AI demo — clicking tabs switches scenarios and messages auto-type one by one with fade-in. Blinking dot shows while messages are still appearing.

- [ ] **Step 5: Commit**

```bash
git add src/components/AIDemo.jsx src/components/DemoSection.jsx src/App.jsx
git commit -m "feat: add DemoSection with auto-typing AIDemo scenarios"
```

---

## Task 7: MediaPlaceholder + Gallery

**Files:**
- Create: `src/components/MediaPlaceholder.jsx`, `src/components/Gallery.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create MediaPlaceholder component**

Write `src/components/MediaPlaceholder.jsx`:

```jsx
export default function MediaPlaceholder({ label, kind = 'photo', height = 220, accent = false }) {
  const seed = label.length;
  const isVideo = kind === 'video';

  return (
    <div
      className="play-card"
      style={{
        position: 'relative',
        height,
        background: accent ? 'var(--accent)' : 'var(--surface)',
        border: '1px solid var(--border)',
        overflow: 'hidden',
        cursor: isVideo ? 'pointer' : 'default',
      }}
    >
      {!isVideo && (
        <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
          <defs>
            <linearGradient id={`g-${seed}`} x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="var(--bg-alt)" />
              <stop offset="100%" stopColor="var(--surface)" />
            </linearGradient>
            <pattern
              id={`p-${seed}`}
              width="20"
              height="20"
              patternUnits="userSpaceOnUse"
              patternTransform={`rotate(${(seed * 17) % 60})`}
            >
              <line x1="0" y1="0" x2="0" y2="20" stroke="var(--border)" strokeWidth="1" />
            </pattern>
          </defs>
          <rect width="400" height="300" fill={`url(#g-${seed})`} />
          <rect width="400" height="300" fill={`url(#p-${seed})`} opacity="0.5" />
          <circle
            cx={80 + ((seed * 30) % 200)}
            cy={120 + ((seed * 13) % 80)}
            r={40 + ((seed * 7) % 40)}
            fill="var(--accent)"
            opacity="0.18"
          />
          <rect
            x={200 + ((seed * 11) % 80)}
            y={60 + ((seed * 5) % 40)}
            width="120"
            height="180"
            fill="none"
            stroke="var(--ink)"
            strokeWidth="1"
            opacity="0.4"
          />
        </svg>
      )}

      {isVideo && (
        <>
          <svg width="100%" height="100%" viewBox="0 0 400 300" preserveAspectRatio="xMidYMid slice" style={{ display: 'block' }}>
            <rect width="400" height="300" fill="var(--ink)" />
            <g opacity="0.5">
              {Array.from({ length: 6 }).map((_, i) => (
                <line key={i} x1="0" y1={50 + i * 40} x2="400" y2={50 + i * 40} stroke="var(--accent)" strokeWidth="0.3" opacity="0.4" />
              ))}
            </g>
            <rect x="30" y="240" width="60" height="2" fill="var(--accent)" />
            <rect x="30" y="240" width="340" height="2" fill="var(--accent)" opacity="0.2" />
          </svg>
          <div style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
          }}>
            <div className="play-btn" style={{
              width: 64,
              height: 64,
              borderRadius: '50%',
              background: 'var(--bg)',
              color: 'var(--ink)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 6px 24px rgba(243, 238, 226, 0.25)',
            }}>
              <svg width="20" height="20" viewBox="0 0 20 20">
                <polygon points="6,4 16,10 6,16" fill="var(--ink)" />
              </svg>
            </div>
          </div>
          <div className="mono" style={{
            position: 'absolute',
            top: 12,
            left: 14,
            fontSize: 10,
            color: 'var(--bg)',
            letterSpacing: '0.15em',
          }}>
            ● REC · 02:14
          </div>
        </>
      )}

      {/* Label */}
      <div className="mono" style={{
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        padding: '10px 14px',
        background: isVideo
          ? 'linear-gradient(transparent, var(--ink))'
          : 'linear-gradient(transparent, rgba(14, 14, 16, 0.8))',
        fontSize: 11,
        letterSpacing: '0.12em',
        color: isVideo ? 'var(--bg)' : 'var(--ink)',
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}>
        <span>{label}</span>
        <span style={{ opacity: 0.6 }}>{isVideo ? 'VIDEO' : 'PHOTO'}</span>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Gallery component**

Write `src/components/Gallery.jsx`:

```jsx
import SectionLabel from './SectionLabel';
import MediaPlaceholder from './MediaPlaceholder';

export default function Gallery() {
  return (
    <section style={{ padding: '120px 56px', borderBottom: '1px solid var(--border)' }}>
      <SectionLabel n="03" label="On site with our customers" />
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'end',
        flexWrap: 'wrap',
        gap: 24,
        marginBottom: 56,
      }}>
        <h2 className="display" style={{
          fontSize: 60,
          margin: 0,
          letterSpacing: '-0.025em',
          maxWidth: 720,
          lineHeight: 1.05,
        }}>
          The British businesses we built an{' '}
          <span className="display-ital" style={{ color: 'var(--accent)' }}>AI Brain</span> for.
        </h2>
        <p style={{ fontSize: 14, color: 'var(--muted)', maxWidth: 280, margin: 0 }}>
          Photographs and short films from real builds — the kitchens, dispatch desks, salons and back
          offices where the brain lives.
        </p>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(6, 1fr)',
        gridAutoRows: '180px',
        gap: 16,
      }}>
        <div style={{ gridColumn: 'span 4', gridRow: 'span 2' }}>
          <MediaPlaceholder label="The 4 AM voicemail · Bristol" kind="video" height="100%" />
        </div>
        <div style={{ gridColumn: 'span 2', gridRow: 'span 1' }}>
          <MediaPlaceholder label="Dispatch desk" kind="photo" height="100%" />
        </div>
        <div style={{ gridColumn: 'span 2', gridRow: 'span 1' }}>
          <MediaPlaceholder label="Sunday order, Leeds" kind="photo" height="100%" />
        </div>
        <div style={{ gridColumn: 'span 3', gridRow: 'span 1' }}>
          <MediaPlaceholder label="Salon · Manchester" kind="photo" height="100%" />
        </div>
        <div style={{ gridColumn: 'span 3', gridRow: 'span 1' }}>
          <MediaPlaceholder label="Walkthrough · 90 sec" kind="video" height="100%" />
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to App.jsx**

Import and add after DemoSection:

```jsx
import Gallery from './components/Gallery';
```

```jsx
<DemoSection />
<Gallery />
```

- [ ] **Step 4: Verify in browser**

Check: Bento grid layout with 6 items. Video placeholders have play buttons and REC overlay. Photo placeholders have procedural SVG art. Labels at bottom of each card.

- [ ] **Step 5: Commit**

```bash
git add src/components/MediaPlaceholder.jsx src/components/Gallery.jsx src/App.jsx
git commit -m "feat: add Gallery with MediaPlaceholder bento grid"
```

---

## Task 8: Stats + CaseStudies

**Files:**
- Create: `src/components/Stats.jsx`, `src/components/CaseStudies.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create Stats component**

Write `src/components/Stats.jsx`:

```jsx
import SectionLabel from './SectionLabel';

const STATS = [
  { n: '5.5M', l: 'private-sector businesses in the UK.', s: 'BEIS, 2024' },
  { n: '<22%', l: 'have meaningfully adopted AI.', s: 'DSIT AI Activity Survey' },
  { n: '£119bn', l: 'projected UK AI economy by 2035.', s: 'Microsoft / Public First' },
  { n: '49%', l: 'of SMEs say "we don\'t know where to start".', s: 'British Chambers of Commerce' },
];

export default function Stats() {
  return (
    <section style={{
      padding: '120px 56px',
      background: 'var(--bg-alt)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionLabel n="04" label="Where British SMEs stand" />
      <h2 className="display" style={{
        fontSize: 68,
        margin: 0,
        letterSpacing: '-0.025em',
        maxWidth: 1000,
        lineHeight: 1.05,
      }}>
        Most British businesses know AI is coming. Almost none know where to start. The hard part
        isn't cost — it's{' '}
        <span className="display-ital" style={{ color: 'var(--accent)' }}>direction.</span>
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(4, 1fr)',
        gap: 32,
        marginTop: 80,
      }}>
        {STATS.map((s, i) => (
          <div key={i} style={{ borderTop: '1px solid var(--ink)', paddingTop: 24 }}>
            <div className="display" style={{
              fontSize: 80,
              lineHeight: 1,
              color: 'var(--ink)',
              letterSpacing: '-0.04em',
            }}>
              {s.n}
            </div>
            <div style={{ fontSize: 16, color: 'var(--ink)', marginTop: 16, lineHeight: 1.4 }}>{s.l}</div>
            <div className="mono" style={{
              fontSize: 11,
              color: 'var(--muted)',
              marginTop: 12,
              letterSpacing: '0.05em',
            }}>
              {s.s}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Create CaseStudies component**

Write `src/components/CaseStudies.jsx`:

```jsx
import SectionLabel from './SectionLabel';
import MediaPlaceholder from './MediaPlaceholder';

const CASES = [
  {
    tag: 'Plumbing & heating · Bristol',
    before: 'After-hours calls slipped to voicemail until morning. Roughly £24,000 a year in lost emergency callouts.',
    after: 'A voicemail-to-dispatch agent triages, texts the on-call engineer and confirms the slot.',
    metric: '14 sec',
    metricLabel: 'avg dispatch',
  },
  {
    tag: 'Restaurant · Leeds',
    before: 'Weekly orders done by hand on a Sunday night. Persistent overstock on perishables.',
    after: 'A POS-aware ordering agent drafts the weekly order. The chef approves with a single tap.',
    metric: '−24%',
    metricLabel: 'food waste',
  },
  {
    tag: 'Salon · Manchester',
    before: "Lapsed clients drifted away. The owner felt awkward \"chasing\" them.",
    after: "A daily rebooking agent sends personalised messages in the owner's voice.",
    metric: '7×',
    metricLabel: 'rebookings/wk',
  },
];

export default function CaseStudies() {
  return (
    <section style={{
      padding: '120px 56px',
      background: 'var(--surface)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionLabel n="05" label="Customers, quietly running" />
      <h2 className="display" style={{
        fontSize: 60,
        margin: 0,
        letterSpacing: '-0.025em',
        maxWidth: 860,
        lineHeight: 1.05,
      }}>
        Quietly running in the background of real British businesses.
      </h2>
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 24,
        marginTop: 60,
      }}>
        {CASES.map((c, i) => (
          <div key={i} style={{
            background: 'var(--bg)',
            border: '1px solid var(--border)',
            padding: 28,
          }}>
            <div className="mono" style={{
              fontSize: 11,
              letterSpacing: '0.12em',
              color: 'var(--accent)',
              textTransform: 'uppercase',
              marginBottom: 24,
            }}>
              {c.tag}
            </div>
            <MediaPlaceholder label={`Case ${i + 1}`} kind="photo" height={140} />
            <div style={{ marginTop: 20 }}>
              <div className="mono" style={{
                fontSize: 10,
                color: 'var(--muted)',
                letterSpacing: '0.15em',
                marginBottom: 6,
              }}>
                BEFORE
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink-soft)', lineHeight: 1.5, marginBottom: 16 }}>
                {c.before}
              </div>
              <div className="mono" style={{
                fontSize: 10,
                color: 'var(--accent)',
                letterSpacing: '0.15em',
                marginBottom: 6,
              }}>
                AFTER
              </div>
              <div style={{ fontSize: 14, color: 'var(--ink)', lineHeight: 1.5 }}>{c.after}</div>
            </div>
            <div style={{
              marginTop: 24,
              paddingTop: 20,
              borderTop: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'baseline',
            }}>
              <span className="display" style={{
                fontSize: 44,
                color: 'var(--accent)',
                letterSpacing: '-0.02em',
              }}>
                {c.metric}
              </span>
              <span style={{ fontSize: 12, color: 'var(--muted)', letterSpacing: '0.05em' }}>
                {c.metricLabel}
              </span>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to App.jsx**

Import and add after Gallery:

```jsx
import Stats from './components/Stats';
import CaseStudies from './components/CaseStudies';
```

```jsx
<Gallery />
<Stats />
<CaseStudies />
```

- [ ] **Step 4: Verify in browser**

Check: Stats section shows 4 large numbers in grid with sources. Case studies shows 3 cards with before/after text and bottom metrics.

- [ ] **Step 5: Commit**

```bash
git add src/components/Stats.jsx src/components/CaseStudies.jsx src/App.jsx
git commit -m "feat: add Stats and CaseStudies sections"
```

---

## Task 9: ROI Calculator

**Files:**
- Create: `src/components/ROICalculator.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create ROICalculator component**

Write `src/components/ROICalculator.jsx`:

```jsx
import { useState, useEffect } from 'react';
import SectionLabel from './SectionLabel';

function useCountUp(target, durationMs = 600) {
  const [val, setVal] = useState(0);
  useEffect(() => {
    let raf;
    let start;
    const to = Number(target) || 0;
    const tick = (t) => {
      if (!start) start = t;
      const p = Math.min(1, (t - start) / durationMs);
      const eased = 1 - Math.pow(1 - p, 3);
      setVal(to * eased);
      if (p < 1) raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [target, durationMs]);
  return val;
}

function Slider({ label, value, setValue, min, max, step, format }) {
  return (
    <div style={{ marginBottom: 22 }}>
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'baseline',
        marginBottom: 8,
      }}>
        <span style={{ fontSize: 13, color: 'var(--muted)', letterSpacing: '0.02em' }}>{label}</span>
        <span style={{ fontSize: 15, fontVariantNumeric: 'tabular-nums', fontWeight: 500 }}>
          {format(value)}
        </span>
      </div>
      <input
        type="range"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => setValue(Number(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--accent)', height: 4 }}
      />
    </div>
  );
}

export default function ROICalculator() {
  const [hours, setHours] = useState(12);
  const [rate, setRate] = useState(35);
  const [employees, setEmployees] = useState(3);
  const [buildCost, setBuildCost] = useState(2500);

  const hoursSavedWeekly = hours * employees * 0.75;
  const weeklySavings = hoursSavedWeekly * rate;
  const annualSavings = weeklySavings * 50;
  const paybackWeeks = Math.max(0.5, buildCost / Math.max(weeklySavings, 1));

  const animatedAnnual = useCountUp(annualSavings);
  const animatedHours = useCountUp(hoursSavedWeekly);
  const animatedPayback = useCountUp(paybackWeeks);

  return (
    <section style={{ padding: '120px 56px', borderBottom: '1px solid var(--border)' }}>
      <SectionLabel n="06" label="Calculator" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.4fr',
        gap: 64,
        alignItems: 'start',
      }}>
        <div style={{ position: 'sticky', top: 100 }}>
          <h2 className="display" style={{
            fontSize: 60,
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: 1.05,
          }}>
            What is manual work{' '}
            <span className="display-ital" style={{ color: 'var(--accent)' }}>actually costing you?</span>
          </h2>
          <p style={{
            fontSize: 16,
            color: 'var(--ink-soft)',
            lineHeight: 1.6,
            marginTop: 24,
            maxWidth: 420,
          }}>
            Drag the sliders. The maths is conservative — we assume automation captures only 75% of the
            hours you describe.
          </p>
        </div>

        <div style={{
          background: 'var(--surface)',
          border: '1px solid var(--border)',
          padding: 32,
          borderRadius: 4,
        }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 40 }}>
            <div>
              <div style={{
                fontSize: 11,
                letterSpacing: '0.18em',
                color: 'var(--muted)',
                marginBottom: 18,
                textTransform: 'uppercase',
              }}>
                Inputs
              </div>
              <Slider
                label="Hours/week on manual work (per person)"
                value={hours}
                setValue={setHours}
                min={2}
                max={40}
                step={1}
                format={(v) => `${v} hrs`}
              />
              <Slider
                label="Hourly value of that time"
                value={rate}
                setValue={setRate}
                min={15}
                max={150}
                step={5}
                format={(v) => `£${v}`}
              />
              <Slider
                label="People doing this work"
                value={employees}
                setValue={setEmployees}
                min={1}
                max={20}
                step={1}
                format={(v) => `${v}`}
              />
              <Slider
                label="One-off build investment"
                value={buildCost}
                setValue={setBuildCost}
                min={1000}
                max={5000}
                step={250}
                format={(v) => `£${v.toLocaleString()}`}
              />
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
              <div style={{
                fontSize: 11,
                letterSpacing: '0.18em',
                color: 'var(--muted)',
                marginBottom: 18,
                textTransform: 'uppercase',
              }}>
                Result
              </div>
              <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: 24 }}>
                <div>
                  <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 6 }}>Annual savings</div>
                  <div style={{
                    fontSize: 52,
                    fontWeight: 300,
                    letterSpacing: '-0.03em',
                    color: 'var(--accent)',
                    fontVariantNumeric: 'tabular-nums',
                    lineHeight: 1,
                  }}>
                    £{Math.round(animatedAnnual).toLocaleString()}
                  </div>
                </div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 16 }}>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Hours saved/wk</div>
                    <div style={{ fontSize: 24, fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>
                      {animatedHours.toFixed(1)}
                    </div>
                  </div>
                  <div>
                    <div style={{ fontSize: 12, color: 'var(--muted)', marginBottom: 4 }}>Payback</div>
                    <div style={{ fontSize: 24, fontWeight: 400, fontVariantNumeric: 'tabular-nums' }}>
                      {animatedPayback < 4
                        ? `${animatedPayback.toFixed(1)} wks`
                        : `${(animatedPayback / 4.33).toFixed(1)} mos`}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to App.jsx**

Import and add after CaseStudies:

```jsx
import ROICalculator from './components/ROICalculator';
```

```jsx
<CaseStudies />
<ROICalculator />
```

- [ ] **Step 3: Verify in browser**

Check: Sliders move and update results in real-time. Annual savings counter animates smoothly. Payback switches between weeks and months display. Left column stays sticky while scrolling.

- [ ] **Step 4: Commit**

```bash
git add src/components/ROICalculator.jsx src/App.jsx
git commit -m "feat: add ROI Calculator with animated counters and interactive sliders"
```

---

## Task 10: Services (ServiceTiers)

**Files:**
- Create: `src/components/Services.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create Services component**

Write `src/components/Services.jsx`:

```jsx
import { useState } from 'react';
import SectionLabel from './SectionLabel';

const TIERS = [
  {
    id: 'scan',
    name: 'Discovery Scan',
    sub: 'Free · 30 min',
    headline: 'Find the leverage.',
    detail: "A structured call. We map your operations, identify the 3 highest-impact automation opportunities, and tell you whether AI is even the right tool. No pitch.",
    bullets: ['30-minute working session', 'Top 3 automation opportunities', 'Honest go/no-go recommendation', 'Written brief within 48h'],
    cta: 'Book the call',
  },
  {
    id: 'build',
    name: 'Custom Build',
    sub: 'SMB · 3–14 days',
    headline: 'Ship the automation.',
    detail: "A working AI system tailored to one or two of your manual workflows. Scheduling, quoting, follow-ups, inventory, support — whatever is bleeding the most time.",
    bullets: ['Built around your actual tools', 'Live in days, not quarters', 'Code and prompts you own', 'Optional support retainer'],
    cta: 'See examples',
  },
  {
    id: 'brain',
    name: 'AI Brain',
    sub: 'Mid-market · 4–8 wks',
    headline: 'Wire the whole operation.',
    detail: 'For 50–500 person firms with multiple processes that need to talk to each other. Diagnostic, architecture, and a connected set of agents that compound.',
    bullets: ['Multi-system integration', 'Agentic pipelines + RAG', 'Stakeholder readout', 'Ongoing strategic support'],
    cta: 'Request scan',
  },
];

export default function Services() {
  const [hovered, setHovered] = useState(null);

  return (
    <section style={{
      padding: '120px 56px',
      background: 'var(--bg-alt)',
      borderBottom: '1px solid var(--border)',
    }}>
      <SectionLabel n="07" label="Ways to work with us" />
      <h2 className="display" style={{
        fontSize: 60,
        margin: 0,
        letterSpacing: '-0.025em',
        maxWidth: 720,
        lineHeight: 1.05,
      }}>
        Three ways in. Pick the one that fits.
      </h2>

      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(3, 1fr)',
        gap: 1,
        background: 'var(--border)',
        border: '1px solid var(--border)',
        marginTop: 60,
      }}>
        {TIERS.map((t) => {
          const isHover = hovered === t.id;
          return (
            <div
              key={t.id}
              onMouseEnter={() => setHovered(t.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                background: isHover ? '#101010' : 'var(--surface)',
                padding: 32,
                transition: 'background 0.2s',
                cursor: 'pointer',
                minHeight: 380,
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <div style={{
                fontSize: 11,
                letterSpacing: '0.18em',
                color: 'var(--accent)',
                textTransform: 'uppercase',
                marginBottom: 4,
              }}>
                {t.name}
              </div>
              <div className="mono" style={{ fontSize: 11, color: 'var(--muted)', marginBottom: 24 }}>
                {t.sub}
              </div>
              <div style={{
                fontSize: 26,
                fontWeight: 300,
                letterSpacing: '-0.02em',
                marginBottom: 16,
                lineHeight: 1.2,
              }}>
                {t.headline}
              </div>
              <div style={{
                fontSize: 14,
                color: 'var(--muted)',
                lineHeight: 1.6,
                marginBottom: 20,
                maxHeight: isHover ? 200 : 0,
                opacity: isHover ? 1 : 0,
                overflow: 'hidden',
                transition: 'all 0.3s',
              }}>
                {t.detail}
              </div>
              <ul style={{ listStyle: 'none', padding: 0, margin: 0, marginBottom: 24, flex: 1 }}>
                {t.bullets.map((b) => (
                  <li key={b} style={{
                    fontSize: 13,
                    color: 'var(--ink)',
                    padding: '6px 0',
                    display: 'flex',
                    gap: 10,
                    alignItems: 'flex-start',
                  }}>
                    <span style={{ color: 'var(--accent)', fontFamily: 'monospace' }}>→</span>
                    <span style={{ opacity: 0.85 }}>{b}</span>
                  </li>
                ))}
              </ul>
              <button style={{
                padding: '12px 18px',
                background: 'transparent',
                border: `1px solid ${isHover ? 'var(--accent)' : 'var(--border)'}`,
                color: isHover ? 'var(--accent)' : 'var(--ink)',
                fontSize: 12,
                letterSpacing: '0.1em',
                cursor: 'pointer',
                textAlign: 'left',
                textTransform: 'uppercase',
                transition: 'all 0.2s',
                fontFamily: 'inherit',
              }}>
                {t.cta} →
              </button>
            </div>
          );
        })}
      </div>

      <p style={{ marginTop: 32, fontSize: 13, color: 'var(--muted)', fontStyle: 'italic' }}>
        Pricing depends on scope and tooling. We'll quote you on the discovery call — no commitment, no
        upsell theatre.
      </p>
    </section>
  );
}
```

- [ ] **Step 2: Add to App.jsx**

Import and add after ROICalculator:

```jsx
import Services from './components/Services';
```

```jsx
<ROICalculator />
<Services />
```

- [ ] **Step 3: Verify in browser**

Check: 3 tier cards with 1px border gaps. Hover reveals detail text with smooth max-height transition. CTA button border animates to accent on hover.

- [ ] **Step 4: Commit**

```bash
git add src/components/Services.jsx src/App.jsx
git commit -m "feat: add Services section with hover-reveal tier cards"
```

---

## Task 11: FAQ accordion

**Files:**
- Create: `src/components/FAQ.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create FAQ component**

Write `src/components/FAQ.jsx`:

```jsx
import { useState } from 'react';
import SectionLabel from './SectionLabel';

const ITEMS = [
  {
    q: 'What is the AI Brain, exactly?',
    a: "It\u2019s a quietly brilliant assistant that sits across the tools you already use \u2014 your diary, your inbox, your phone, your stock system, your accounts \u2014 and gets the boring stuff done for you. It picks up the calls you miss, drafts the messages you don\u2019t have time to write, and queues up tomorrow before you\u2019ve had your tea. You stay in charge; the Brain just clears the runway.",
  },
  {
    q: 'How quickly can something go live?',
    a: 'A focused build for a single workflow typically goes live in 3\u201314 days. Larger, multi-system \u201cbrains\u201d take 4\u20138 weeks. We give you a realistic timeline on the discovery call \u2014 never a soft sell.',
  },
  {
    q: 'Will this work with the tools we already use?',
    a: "Yes. The Brain plugs into the systems you\u2019re already running \u2014 your diary, your accounts package, your phone system, your card reader, your CRM, your inbox. We don\u2019t ask you to rip anything out, learn a new dashboard, or change how your team works. You shouldn\u2019t have to reshape your business around the technology.",
  },
  {
    q: 'Do we own what you build?',
    a: 'Completely. Code, prompts, system credentials. If you walk away tomorrow, the system keeps running and you can hand it to anyone.',
  },
  {
    q: 'Will this replace our staff?',
    a: "Almost never the goal, almost never the outcome. The work we automate is the work nobody wants to do \u2014 late-night triage, tedious data entry, follow-ups that fall through the cracks. Your people get to do the work they were hired for.",
  },
  {
    q: 'How do you handle data and GDPR?',
    a: 'Data stays in your accounts. We sign DPAs, keep processing inside the UK/EU where required, and design every system with audit logs and a clear human escalation path. We can work with you on a DPIA if your sector needs one.',
  },
  {
    q: 'What happens if something breaks?',
    a: "Every system we ship logs every action and has a clear human-escalation path for ambiguous cases. If something fails, you\u2019ll know within minutes \u2014 and on a retainer, we\u2019ll have it back up before you finish your coffee.",
  },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);

  return (
    <section style={{ padding: '120px 56px', borderBottom: '1px solid var(--border)' }}>
      <SectionLabel n="08" label="FAQ" />
      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 2fr',
        gap: 80,
        alignItems: 'start',
      }}>
        <h2 className="display" style={{
          fontSize: 60,
          margin: 0,
          letterSpacing: '-0.025em',
          lineHeight: 1.05,
        }}>
          Things people ask before they book.
        </h2>
        <div>
          {ITEMS.map((it, i) => (
            <div key={i} style={{
              borderTop: '1px solid var(--border)',
              ...(i === ITEMS.length - 1 ? { borderBottom: '1px solid var(--border)' } : {}),
            }}>
              <button
                onClick={() => setOpen(open === i ? -1 : i)}
                style={{
                  width: '100%',
                  textAlign: 'left',
                  padding: '24px 0',
                  background: 'none',
                  border: 'none',
                  cursor: 'pointer',
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                  fontFamily: 'inherit',
                  color: 'var(--ink)',
                  fontSize: 19,
                }}
              >
                <span>{it.q}</span>
                <span style={{
                  color: 'var(--accent)',
                  fontSize: 24,
                  transition: 'transform 0.3s',
                  transform: open === i ? 'rotate(45deg)' : 'rotate(0deg)',
                }}>
                  +
                </span>
              </button>
              <div style={{
                maxHeight: open === i ? 240 : 0,
                overflow: 'hidden',
                transition: 'max-height 0.4s ease',
                fontSize: 15,
                color: 'var(--ink-soft)',
                lineHeight: 1.65,
              }}>
                <div style={{ paddingBottom: 24, maxWidth: 680 }}>{it.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
```

- [ ] **Step 2: Add to App.jsx**

Import and add after Services:

```jsx
import FAQ from './components/FAQ';
```

```jsx
<Services />
<FAQ />
```

- [ ] **Step 3: Verify in browser**

Check: FAQ has two-column layout with headline left and accordion right. First item open by default. Clicking questions toggles them (only one open at a time). "+" rotates to "×" when open. Answer slides in/out smoothly.

- [ ] **Step 4: Commit**

```bash
git add src/components/FAQ.jsx src/App.jsx
git commit -m "feat: add FAQ section with accordion"
```

---

## Task 12: BookingFlow + Book section

**Files:**
- Create: `src/components/BookingFlow.jsx`, `src/components/Book.jsx`
- Modify: `src/App.jsx`

- [ ] **Step 1: Create BookingFlow component**

Write `src/components/BookingFlow.jsx`:

```jsx
import { useState } from 'react';

const BUSINESS_TYPES = [
  'Trades & home services',
  'Salons, spas & clinics',
  'Hospitality & food',
  'Solicitors & accountants',
  'Independent retail / e-commerce',
  'Mid-market firm (50+)',
  'Other',
];

const SIZES = ['Just me', '2\u201310', '11\u201350', '51\u2013200', '200+'];

const PAINS = [
  'Manual scheduling',
  'Slow quoting/estimates',
  'Missed follow-ups',
  'Inventory & ordering',
  'Customer support load',
  'Reporting & data wrangling',
  'Lead routing',
  'Onboarding & docs',
];

const SLOTS = ['Tue 10:00', 'Tue 14:30', 'Wed 09:00', 'Wed 15:30', 'Thu 11:30', 'Fri 16:00'];

const STEPS = [
  { label: 'Your business', n: '01' },
  { label: 'Pain points', n: '02' },
  { label: 'Contact', n: '03' },
  { label: 'Pick a time', n: '04' },
];

export default function BookingFlow({ accent, muted, surfaceBg, borderColor, textColor }) {
  const [step, setStep] = useState(0);
  const [data, setData] = useState({
    type: '',
    size: '',
    pain: [],
    name: '',
    business: '',
    email: '',
    time: '',
  });

  const update = (k, v) => setData((d) => ({ ...d, [k]: v }));
  const togglePain = (p) =>
    setData((d) => ({
      ...d,
      pain: d.pain.includes(p) ? d.pain.filter((x) => x !== p) : [...d.pain, p],
    }));

  const canProceed = () => {
    if (step === 0) return data.type && data.size;
    if (step === 1) return data.pain.length > 0;
    if (step === 2) return data.name && data.business && data.email.includes('@');
    if (step === 3) return data.time;
    return true;
  };

  const chipStyle = (active) => ({
    padding: '8px 14px',
    border: `1px solid ${active ? accent : borderColor}`,
    background: active ? accent : 'transparent',
    color: active ? '#000' : textColor,
    fontSize: 13,
    cursor: 'pointer',
    borderRadius: 2,
    transition: 'all 0.15s',
    fontFamily: 'inherit',
  });

  const inputStyle = {
    width: '100%',
    background: 'transparent',
    border: 'none',
    borderBottom: `1px solid ${borderColor}`,
    padding: '12px 0',
    color: textColor,
    fontSize: 16,
    outline: 'none',
    fontFamily: 'inherit',
  };

  if (step === 4) {
    return (
      <div style={{
        background: surfaceBg,
        padding: 48,
        border: `1px solid ${borderColor}`,
        textAlign: 'center',
        minHeight: 460,
      }}>
        <div style={{ fontSize: 11, letterSpacing: '0.18em', color: accent, marginBottom: 24 }}>
          CONFIRMED
        </div>
        <div style={{ fontSize: 32, fontWeight: 300, letterSpacing: '-0.02em', marginBottom: 12 }}>
          We're on for {data.time.toLowerCase()}.
        </div>
        <div style={{
          color: muted,
          fontSize: 15,
          maxWidth: 420,
          margin: '0 auto',
          lineHeight: 1.6,
        }}>
          A calendar invite is on the way to {data.email}. I'll review {data.business} beforehand and
          come ready with a working hypothesis.
        </div>
        <button
          onClick={() => {
            setStep(0);
            setData({ type: '', size: '', pain: [], name: '', business: '', email: '', time: '' });
          }}
          style={{
            marginTop: 32,
            padding: '10px 20px',
            border: `1px solid ${borderColor}`,
            background: 'transparent',
            color: textColor,
            fontSize: 13,
            cursor: 'pointer',
            fontFamily: 'inherit',
          }}
        >
          Book another
        </button>
      </div>
    );
  }

  return (
    <div style={{
      background: surfaceBg,
      border: `1px solid ${borderColor}`,
      padding: 36,
      minHeight: 460,
      display: 'flex',
      flexDirection: 'column',
    }}>
      {/* Step rail */}
      <div style={{ display: 'flex', gap: 0, marginBottom: 32, borderBottom: `1px solid ${borderColor}` }}>
        {STEPS.map((s, i) => (
          <div
            key={i}
            onClick={() => i < step && setStep(i)}
            style={{
              flex: 1,
              padding: '0 0 12px 0',
              cursor: i < step ? 'pointer' : 'default',
              borderBottom: `2px solid ${i === step ? accent : 'transparent'}`,
              marginBottom: -1,
              opacity: i <= step ? 1 : 0.4,
              transition: 'all 0.2s',
            }}
          >
            <div style={{ fontSize: 10, color: muted, letterSpacing: '0.15em' }}>{s.n}</div>
            <div style={{ fontSize: 13, marginTop: 2 }}>{s.label}</div>
          </div>
        ))}
      </div>

      {/* Step content */}
      <div style={{ flex: 1 }}>
        {step === 0 && (
          <div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 14, letterSpacing: '0.05em' }}>
              What kind of business?
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 28 }}>
              {BUSINESS_TYPES.map((t) => (
                <button key={t} onClick={() => update('type', t)} style={chipStyle(data.type === t)}>
                  {t}
                </button>
              ))}
            </div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 14, letterSpacing: '0.05em' }}>
              Team size
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {SIZES.map((s) => (
                <button key={s} onClick={() => update('size', s)} style={chipStyle(data.size === s)}>
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 1 && (
          <div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 14, letterSpacing: '0.05em' }}>
              What's eating your time? Pick all that apply.
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
              {PAINS.map((p) => (
                <button key={p} onClick={() => togglePain(p)} style={chipStyle(data.pain.includes(p))}>
                  {data.pain.includes(p) ? '✓ ' : '+ '}
                  {p}
                </button>
              ))}
            </div>
          </div>
        )}
        {step === 2 && (
          <div>
            <input
              style={inputStyle}
              placeholder="Your name"
              value={data.name}
              onChange={(e) => update('name', e.target.value)}
            />
            <div style={{ height: 18 }} />
            <input
              style={inputStyle}
              placeholder="Business name"
              value={data.business}
              onChange={(e) => update('business', e.target.value)}
            />
            <div style={{ height: 18 }} />
            <input
              style={inputStyle}
              placeholder="Email"
              type="email"
              value={data.email}
              onChange={(e) => update('email', e.target.value)}
            />
          </div>
        )}
        {step === 3 && (
          <div>
            <div style={{ fontSize: 13, color: muted, marginBottom: 14, letterSpacing: '0.05em' }}>
              30 minutes. No prep required.
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 8 }}>
              {SLOTS.map((s) => (
                <button
                  key={s}
                  onClick={() => update('time', s)}
                  style={{ ...chipStyle(data.time === s), padding: '14px 10px', textAlign: 'center' }}
                >
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Footer */}
      <div style={{
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginTop: 28,
      }}>
        <button
          onClick={() => setStep((s) => Math.max(0, s - 1))}
          disabled={step === 0}
          style={{
            background: 'none',
            border: 'none',
            color: muted,
            fontSize: 13,
            cursor: step === 0 ? 'default' : 'pointer',
            opacity: step === 0 ? 0.3 : 1,
            fontFamily: 'inherit',
          }}
        >
          ← Back
        </button>
        <button
          onClick={() => canProceed() && setStep((s) => s + 1)}
          disabled={!canProceed()}
          style={{
            padding: '12px 22px',
            background: canProceed() ? accent : borderColor,
            color: canProceed() ? '#000' : muted,
            border: 'none',
            fontSize: 13,
            cursor: canProceed() ? 'pointer' : 'default',
            letterSpacing: '0.05em',
            fontFamily: 'inherit',
            fontWeight: 500,
          }}
        >
          {step === 3 ? 'Confirm' : 'Continue →'}
        </button>
      </div>
    </div>
  );
}
```

- [ ] **Step 2: Create Book section component**

Write `src/components/Book.jsx`:

```jsx
import BookingFlow from './BookingFlow';

export default function Book() {
  const accent = 'var(--accent)';
  // For the inverted section, we use bg color as text
  const bgColor = '#0e0e10';
  const textColor = '#f3eee2';

  return (
    <section style={{
      padding: '120px 56px',
      background: 'var(--ink)',
      color: 'var(--bg)',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decorative blur */}
      <div style={{
        position: 'absolute',
        top: -100,
        right: -100,
        width: 400,
        height: 400,
        borderRadius: '50%',
        background: 'var(--accent)',
        opacity: 0.18,
        filter: 'blur(80px)',
      }} />

      {/* Section label — custom colors for inverted section */}
      <div className="mono" style={{
        fontSize: 11,
        letterSpacing: '0.18em',
        textTransform: 'uppercase',
        marginBottom: 40,
        display: 'flex',
        gap: 16,
      }}>
        <span style={{ color: 'var(--accent)' }}>09</span>
        <span style={{ color: 'rgba(14, 14, 16, 0.5)' }}>—</span>
        <span style={{ color: 'rgba(14, 14, 16, 0.5)' }}>Start</span>
      </div>

      <div style={{
        display: 'grid',
        gridTemplateColumns: '1fr 1.2fr',
        gap: 64,
        alignItems: 'start',
        position: 'relative',
      }}>
        <div>
          <h2 className="display" style={{
            fontSize: 72,
            margin: 0,
            letterSpacing: '-0.025em',
            lineHeight: 1.0,
          }}>
            Thirty minutes.
            <br />
            Honest answer.
            <br />
            <span className="display-ital" style={{ color: 'var(--accent)' }}>No pitch.</span>
          </h2>
          <p style={{
            fontSize: 17,
            color: 'rgba(14, 14, 16, 0.7)',
            lineHeight: 1.6,
            marginTop: 32,
            maxWidth: 460,
          }}>
            Bring the workflow that's costing you the most time. We'll tell you whether AI can fix it,
            what it would take, and roughly what it would cost. If it's not worth doing, we say so.
          </p>
          <div style={{
            marginTop: 48,
            paddingTop: 32,
            borderTop: '1px solid rgba(14, 14, 16, 0.15)',
          }}>
            <div className="mono" style={{
              fontSize: 11,
              color: 'rgba(14, 14, 16, 0.5)',
              letterSpacing: '0.15em',
              marginBottom: 12,
            }}>
              OR REACH OUT DIRECTLY
            </div>
            <div style={{ fontSize: 18 }}>hello@acumei.co.uk</div>
            <div style={{ fontSize: 14, color: 'rgba(14, 14, 16, 0.5)', marginTop: 6 }}>
              Studio: 12 Rivington Street, London EC2A · By appointment
            </div>
          </div>
        </div>

        <BookingFlow
          accent="#e8a04b"
          muted="rgba(14, 14, 16, 0.55)"
          surfaceBg="rgba(14, 14, 16, 0.04)"
          borderColor="rgba(14, 14, 16, 0.15)"
          textColor={bgColor}
        />
      </div>
    </section>
  );
}
```

- [ ] **Step 3: Add to App.jsx**

Import and add after FAQ, before Footer:

```jsx
import Book from './components/Book';
```

```jsx
<FAQ />
<Book />
```

- [ ] **Step 4: Verify in browser**

Check: Book section has inverted colors (cream bg, dark text). Blurred ochre circle in top-right. Left column has headline, body text, and contact info. Right column has 4-step booking wizard — click through all steps verifying: chip selection works, multi-select pain points work, form inputs work, time slot selection works, confirmation screen shows after step 4 with "Book another" reset.

- [ ] **Step 5: Commit**

```bash
git add src/components/BookingFlow.jsx src/components/Book.jsx src/App.jsx
git commit -m "feat: add Book section with multi-step BookingFlow wizard"
```

---

## Task 13: Final App.jsx assembly + polish

**Files:**
- Modify: `src/App.jsx`

- [ ] **Step 1: Verify complete App.jsx**

Ensure `src/App.jsx` has all imports and components in the correct order:

```jsx
import { useState, useEffect } from 'react';
import Nav from './components/Nav';
import Hero from './components/Hero';
import Marquee from './components/Marquee';
import HowItWorks from './components/HowItWorks';
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
        <HowItWorks />
        <DemoSection />
        <Gallery />
        <Stats />
        <CaseStudies />
        <ROICalculator />
        <Services />
        <FAQ />
        <Book />
      </main>
      <Footer />
    </>
  );
}
```

- [ ] **Step 2: Full page scroll-through verification**

Open `http://localhost:5173` and scroll through the entire page. Verify each section in order:

1. **Nav** — sticky, blurred bg, logo + links + CTA
2. **Hero** — headline, brain graphic animating, live feed, tags, CTAs
3. **Marquee** — continuous scroll, alternating opacity
4. **How It Works** — 4-column step grid
5. **Demo Section** — two columns, AI demo auto-types on tab switch
6. **Gallery** — bento grid, video play buttons
7. **Stats** — 4 large numbers
8. **Case Studies** — 3 before/after cards with metrics
9. **ROI Calculator** — sliders update results with animation
10. **Services** — 3 tier cards, hover reveals detail
11. **FAQ** — accordion, one open at a time
12. **Book** — inverted section, booking wizard works through all 4 steps
13. **Footer** — copyright + links

- [ ] **Step 3: Fix any visual issues found in verification**

Address font rendering, spacing, or color issues discovered during the scroll-through. Common things to check:
- Grain overlay visible on hero
- Nav background blur working
- Animations running smoothly (brain, marquee, pulse dots)
- Correct alternating section backgrounds (bg vs bg-alt vs surface)

- [ ] **Step 4: Commit**

```bash
git add src/App.jsx
git commit -m "feat: assemble complete Acumei landing page with all 13 sections"
```
