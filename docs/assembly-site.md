# Assembly site: module map and how it works

The site is the "W4 Assembly" direction: one isometric machine, drawn on a canvas, that is
engineered part by part as you scroll, with hairline callouts and drawing-sheet furniture.

## Module map

```
src/lib/assembly/
  math.js        clamp, sm (smoothstep), lin, lerp, backOut (5% overshoot), hash, Bayer matrix, colours
  machine.js     the part list (4 groups + DEMO cube), cable paths, rack size, SETS (subassemblies for
                 PartDrawing), partForField() (old PageField mode -> default part)
  renderer.js    createRenderer(canvas): iso projection, painter's sort, Bayer-dithered faces, hairlines,
                 cables + amber pulses, rack, blueprint grid, dimension lines, part labels with collision
                 avoidance, the closing Acumei mark. draw(state, view, t); anchors{} for callouts
  scenes.js      pure scroll -> state functions: readLayout(), homeState(), homeView(), partScene(), partView()
src/lib/motion.js   the one rAF loop (onFrame), STATIC flag, initialScrollY() for ?y=N
src/components/
  Nav.jsx, Footer.jsx, Mark.jsx     header (mono links, amber "Book a call", mobile menu), datasheet footer
  BookCall.jsx                      Calendly modal link; className prop ('act' default, 'btn', 'btn-o')
  PageShell.jsx                     inner-page frame (title block, prose, sticky PartDrawing)
  PartDrawing.jsx                   canvas of one subassembly, driven by page scroll progress
  home/                             Stage (canvas + leaders + loop), Hero, Problem, Services, Process,
                                    Principles, Work, Lab, Closing
src/styles/assembly.css             header, menu, footer, drawing-sheet primitives, all home sections
src/styles/assembly-page.css        PageShell, title block, PartDrawing, datasheet .prose
```

Old files kept: `lib/dither.js` + `hooks/useDither.js` (used for the Notes thumbnails), `hooks/useReveal.js`
(inner pages' `data-reveal`), `components/ScrollManager.jsx`, `pages.css` (tiers, FAQ rows, routes),
`sections.css` (only the `.notes/.note` rows used by /notes), `case-study-premo.css`.

## How the machine and scroll loop work

* `Stage` (home only) mounts a fixed canvas (right 55% of the viewport; on phones a 40vh band with no frame that fades out over Work/Notes and scrolls off with the closing scene), an SVG overlay
  for leader lines and the drawing title block. It subscribes one callback to `motion.onFrame`.
* Each frame: eased scroll (`shown += (scrollY - shown) * 0.18`) -> `homeState()` -> `renderer.draw()`.
  `homeState` turns document positions of the `[data-scene]` elements (cached by `readLayout()` on resize)
  into progress values: hero drift `d`, problem `g1/g2`, per-service assembly `q[0..3]`, process progress `P`
  (fill `F`, power `W`, rack `Rk`, slide `mx`), principles highlight, closing `cl` (mark `mk`, pulse).
* Each part has an assembled position plus an exploded offset; its position is
  `assembled + offset * (1 - backOut(progress))`, so settling and overshoot are deterministic and reversible.
* The same loop also drives text: `.land` elements ease in by position, the process readout/steps, principles
  rows, closing words. Sections are plain markup; the contract is data attributes:
  `data-scene="p1|p2|svc0-3|process|principles|work|lab|closing"`, `data-anchor="data|core|agents|ops|machine|demo|ghost"`
  on a label (a leader line is drawn from it to that part), `data-row`, `data-steps`, `data-sd`, `data-ro`,
  `data-cw` (closing words), `data-cc`, `data-sticky` (sticky container, rect read live).
* `?y=N` scrolls instantly and snaps eased values, so screenshots show the true state at that depth.
  `?motion=off` and `prefers-reduced-motion` give the finished, assembled, powered machine with every text
  block visible and no pinned scroll scenes (`.asm-static`).
* Home section ids for nav anchors: `services`, `process`, `work`, `notes`, `book` (closing).

## PartDrawing and PageShell

```jsx
<PageShell n="03" label="Pricing" title={...} lede="..." meta="..." part="operations">
  ...prose sections...
</PageShell>
```

* `part`: `'data' | 'models' | 'agents' | 'operations' | 'machine' | 'lamp'`. If omitted, the old `field`
  prop is mapped (`brain` -> machine, `ridge` -> data, `orb` -> models, `grid` -> agents, `wave` -> operations,
  `scatter` -> lamp). Default is `machine`.
* The drawing assembles as the reader scrolls (a little assembled on arrival) and turns slowly. Static mode
  shows it assembled. On phones it is a 30vh band stuck under the header.
* Prose: `h2` (hairline rule with amber tick), `h3` (mono label), lists, ordered lists, `table`, `blockquote`,
  `code`, links, `.lead` are all styled in `assembly-page.css`.
* Adding a page: create `src/pages/X.jsx` using `PageShell`, add a `<Route>` in `App.jsx`, link it from `Nav`
  `LINKS` or `Footer` `COLUMNS` if needed.

## Removed

The six illustrative case-study pages (dental-practice, construction, plumbing, b2b-saas, restaurant, salon)
and their routes; `vercel.json` redirects those paths to `/#work`. The ROI calculator, testimonials, stats,
industry/agent/live-feed home sections and their hooks (`useParallax`, `useFieldInteraction`, `useInView`,
`scrollLoop`) are deleted.
