# Acumei "Warm Minimal" — React Port

## Overview

Pixel-faithful port of the Acumei website "Direction A: Warm Minimal" (Ink & Ochre palette) from a bundled HTML prototype into a clean Vite + React application. All interactive components are fully functional. Desktop-first, single page, no routing.

## Stack

- **Vite + React** (latest stable)
- **Plain CSS** — no framework, no CSS-in-JS
- **Self-hosted fonts** — Fraunces (variable), Inter (variable), JetBrains Mono (variable) as woff2

## Palette: Ink & Ochre

| Token       | Value     | Usage                        |
|-------------|-----------|------------------------------|
| bg          | `#0e0e10` | Page background              |
| bgAlt       | `#16161a` | Alternating section bg       |
| ink         | `#f3eee2` | Primary text                 |
| inkSoft     | `#b9b3a4` | Secondary text               |
| muted       | `#7a746a` | Labels, captions             |
| border      | `#2a2a2e` | Borders, dividers            |
| accent      | `#e8a04b` | CTAs, highlights, ochre      |
| accentSoft  | `#3a2e1c` | Subtle accent bg             |
| surface     | `#18181c` | Cards, elevated surfaces     |

All exposed as CSS custom properties in `theme.css`.

## Typography

| Class         | Font           | Weight | Usage                      |
|---------------|----------------|--------|----------------------------|
| `.display`    | Fraunces       | 380    | Headlines, large numbers   |
| `.display-ital` | Fraunces italic | 380  | Accent/italic headlines    |
| `.mono`       | JetBrains Mono | 400    | Labels, tags, timestamps   |
| body          | Inter          | 200-600| Body text                  |

Fraunces uses variable font settings: `"opsz" 144, "SOFT" 50` (normal), `"SOFT" 100` (italic).

## File Structure

```
src/
  components/
    Nav.jsx
    Hero.jsx
    BrainGraphic.jsx
    Marquee.jsx
    HowItWorks.jsx
    DemoSection.jsx
    AIDemo.jsx
    Gallery.jsx
    Stats.jsx
    CaseStudies.jsx
    ROICalculator.jsx
    Services.jsx
    FAQ.jsx
    BookingFlow.jsx
    Footer.jsx
    SectionLabel.jsx
    MediaPlaceholder.jsx
  styles/
    theme.css
    fonts.css
    animations.css
    global.css
  fonts/
    Fraunces-Variable.woff2
    Fraunces-Italic-Variable.woff2
    Inter-Variable.woff2
    JetBrainsMono-Variable.woff2
  App.jsx
  main.jsx
  index.css           (imports all style files)
```

## Sections (in page order)

### 1. Nav (`Nav.jsx`)
- Sticky, top: 0, z-index: 50
- Blurred translucent background (`backdrop-filter: blur(12px)`)
- Left: SVG logo (circle + crosshair + accent dot) + "Acumei" in display font
- Center: links — "The AI Brain", "How it works", "Customers", "Pricing", "FAQ"
- Right: "Book a call →" pill button (ink bg, bg text)

### 2. Hero (`Hero.jsx` + `BrainGraphic.jsx`)
- Two-column grid: 1.25fr / 1fr
- Left column:
  - Mono label with pulsing dot: "AI for British businesses · London"
  - h1 at 104px: "The AI Brain your business was promised."
  - Body paragraph describing the AI Brain
  - Tag chips (pill-shaped, bordered): "Stops calls slipping", "Books appointments back in", etc.
  - Two CTAs: solid pill "Book a 30-minute discovery call" with animated arrow, outlined pill "See live examples"
- Right column:
  - BrainGraphic SVG: animated concentric rings, 8 orbiting system nodes (CRM, Diary, POS, SMS, Email, Stock, Reviews, Pay) with traveling signal dots, breathing core with "AI brain" text
  - Live activity feed card: "Today, across the network" with LIVE indicator, 4 rows showing time/label/status
- Bottom: "NOW SERVING:" row listing industries
- Background: grain overlay via SVG noise filter

### 3. BrainGraphic (`BrainGraphic.jsx`)
- Pure SVG, 100x100 viewBox
- Radial gradient glow behind core
- 3 pulse rings animating outward
- 2 rotating dashed rings (opposite directions, different speeds)
- 8 system nodes at computed positions around center, each with:
  - Connector line from center
  - Traveling signal dot (SVG animateMotion)
  - Node circle with accent center dot
  - Label text
- Breathing core circle with Gaussian blur
- Center: accent circle with "AI" (mono) + "brain" (display italic)

### 4. Marquee (`Marquee.jsx`)
- Full-width strip with top/bottom borders
- bgAlt background
- Duplicated text array for seamless loop
- CSS animation: `translateX(0)` to `translateX(-50%)`, 40s linear infinite
- Items in display font at 32px, alternating full/40% opacity, separated by ochre "✱"

### 5. How It Works (`HowItWorks.jsx`)
- Section label: "01 — How we work"
- Headline at 68px: "From 'we have a problem' to a quieter business — in a fortnight."
- 4-column grid of steps, each with:
  - Top border (ink color)
  - Timeline label (mono, muted): "Day 1", "Day 2", "Days 3–10", "Day 14"
  - Step number in display font at 56px (accent color)
  - Step title at 22px
  - Description text

### 6. Demo Section (`DemoSection.jsx` + `AIDemo.jsx`)
- bgAlt background
- Two-column: text left, AIDemo right
- Left: headline, body text, 3-item list with arrow indicators
- AIDemo: tabbed interface with 3 scenarios (Plumbing dispatch, Restaurant ordering, Salon rebooking)
  - Tab bar at top with industry label + scenario name
  - Auto-typing messages appear one at a time (1100ms interval)
  - Each message has role prefix (◦ system, " transcript, ▸ agent, ✓ result)
  - Blinking dot while typing
  - Fade-in animation per message

### 7. Gallery (`Gallery.jsx` + `MediaPlaceholder.jsx`)
- Section label: "03 — On site with our customers"
- Headline + description side by side
- Bento grid (6 columns, auto rows at 180px):
  - Large video (4 cols, 2 rows): "The 4 AM voicemail · Bristol"
  - 2 photos (2 cols each): "Dispatch desk", "Sunday order, Leeds"
  - 2 items (3 cols each): "Salon · Manchester" (photo), "Walkthrough · 90 sec" (video)
- MediaPlaceholder renders procedural SVG art (gradients, line patterns, circles) — not actual images
- Video placeholders include play button and "REC · 02:14" overlay

### 8. Stats (`Stats.jsx`)
- bgAlt background
- Section label: "04 — Where British SMEs stand"
- Headline at 68px about AI adoption gap
- 4-column stat grid, each with:
  - Top border (ink)
  - Large number in display font at 80px
  - Description text
  - Source citation in mono

### 9. Case Studies (`CaseStudies.jsx`)
- Surface background
- Section label: "05 — Customers, quietly running"
- 3-column grid of case cards, each with:
  - Industry tag (mono, accent, uppercase)
  - MediaPlaceholder image
  - Before/After sections with mono labels
  - Bottom metric display (large accent number + label)

### 10. ROI Calculator (`ROICalculator.jsx`)
- Two-column: sticky text left, calculator right
- Left: headline about costs, description about conservative assumptions
- Right: surface card with two sub-columns:
  - Inputs: 4 range sliders (hours/week, hourly rate, employees, build cost)
  - Results: animated counters for annual savings (large, accent), hours saved/week, payback period
- Calculations: `hoursSaved = hours * employees * 0.75`, `annual = hoursSaved * rate * 50`
- Animated count-up on value changes (cubic ease-out, 600ms)

### 11. Services (`Services.jsx`)
- bgAlt background
- Section label: "07 — Ways to work with us"
- 3-column grid with 1px gap (border effect), each tier:
  - Name (mono, accent, uppercase)
  - Subtitle (mono, muted)
  - Headline
  - Detail text (hidden, reveals on hover with max-height transition)
  - Bullet list with arrow prefixes
  - CTA button (border animates to accent on hover)
- Tiers: Discovery Scan (Free), Custom Build (3-14 days), AI Brain (4-8 wks)

### 12. FAQ (`FAQ.jsx`)
- Section label: "08 — FAQ"
- Two-column: headline left (1fr), accordion right (2fr)
- 7 items, each with:
  - Question as full-width button
  - "+" icon that rotates 45deg when open
  - Answer with max-height transition (0 ↔ 240px, 0.4s ease)
  - One item open at a time

### 13. Booking Flow (`BookingFlow.jsx`)
- Inverted section: ink background, bg text color
- Decorative blurred accent circle (top-right)
- Two-column: text left, form right
- Left: headline, body text, contact details (email, address)
- Form: 4-step wizard
  - Step 1: business type chips + team size chips
  - Step 2: pain point multi-select chips
  - Step 3: name, business, email text inputs
  - Step 4: time slot grid (3x2)
  - Step rail at top showing progress
  - Back/Continue navigation, validation per step
  - Confirmation state after step 4

### 14. Footer (`Footer.jsx`)
- Ink background, muted text
- Flex row: copyright left, links right (email, LinkedIn, Privacy)

## Animations

All defined in `animations.css`:

| Name             | Purpose                                        |
|------------------|-------------------------------------------------|
| `a-marq`         | Marquee scroll (translateX, 40s linear)         |
| `a-pulse`        | Pulsing dot (opacity + scale, 2s)               |
| `a-reveal`       | Fade-up on appear (opacity + translateY, 0.8s)  |
| `a-arrow`        | CTA arrow bounce (translateX, 2.4s)             |
| `a-brain-pulse`  | Brain rings expanding outward (scale, 3.6s)     |
| `a-brain-orbit`  | Outer ring rotation (60s)                        |
| `a-brain-orbit-rev` | Mid ring reverse rotation (40s)              |
| `a-brain-breathe`| Core breathing (scale, 4s)                      |
| `demoFadeIn`     | AI demo message appear (opacity + translateY)   |
| `acumeiBlink`    | Typing indicator blink (opacity, 1s)            |

## Excluded from port

- DesignCanvas / DCArtboard / DCSection (presentation wrapper)
- TweaksPanel and palette switcher (design tool UI)
- Palette definitions other than Ink & Ochre (can be added later via CSS vars)
- Responsive breakpoints (desktop-only as designed at 1280px)
- Routing (single page)

## Fonts to self-host

Download variable woff2 files from Google Fonts:
- **Fraunces** — normal + italic, variable weight + optical size + SOFT axis
- **Inter** — variable weight (200-600 range used)
- **JetBrains Mono** — regular weight
