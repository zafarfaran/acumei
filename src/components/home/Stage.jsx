import { useEffect, useRef } from 'react';
import { createRenderer } from '../../lib/assembly/renderer';
import { homeState, homeView, readLayout } from '../../lib/assembly/scenes';
import { clamp, sm, lin } from '../../lib/assembly/math';
import { onFrame, invalidate, STATIC, initialScrollY } from '../../lib/motion';

const NS = 'http://www.w3.org/2000/svg';

/**
 * The sticky machine stage for the home page: a fixed canvas on the right 55%
 * (a 40vh band on phones), the leader-line overlay and the drawing title block.
 * It also drives every other scroll-linked thing on the page (text landing,
 * process readout, principles rows, closing words) from the same loop, so
 * sections stay plain markup. See docs/assembly-site.md for the DOM contract.
 */
export default function Stage() {
  const canvasRef = useRef(null);
  const svgRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current, svg = svgRef.current;
    const R = createRenderer(canvas);
    const q = (s, r = document) => r.querySelector(s);
    const qa = (s, r = document) => [...r.querySelectorAll(s)];

    let W = 0, H = 0, mobile = false, bandH = 0, cw = 0, ch = 0, cvLeft = 0, cvTop = 0;
    let L = null;
    let shown = 0, introT = STATIC ? 1 : 0, lastShown = -1, dirty = true, frameN = 0, lastT = 0, snapNext = false;
    const hl = [0, 0, 0, 0];

    const lands = qa('.land').map((el) => ({ el, top: 0, hero: !!el.closest('[data-scene="hero"]') }));
    const steps = qa('[data-steps] li');
    const sdp = qa('[data-sd] p');
    const roEl = q('[data-ro]');
    const rows = qa('[data-row]');
    const words = qa('[data-cw]');
    const cc = q('[data-cc]');

    const callouts = qa('[data-anchor]').map((el) => {
      const g = document.createElementNS(NS, 'g'), h = document.createElementNS(NS, 'path'), p = document.createElementNS(NS, 'path'), c = document.createElementNS(NS, 'circle');
      h.setAttribute('class', 'halo');
      for (const n of [h, p]) { n.style.strokeDasharray = '9999'; n.style.strokeDashoffset = '9999'; }
      c.setAttribute('r', 3.2); c.style.opacity = 0;
      g.append(h, p, c); svg.append(g);
      return { el, anchor: el.dataset.anchor, g, p, hl: h, c, a: 0, isRow: el.hasAttribute('data-row'), docTop: 0, right: 0, h: 0, sticky: false };
    });

    function layout() {
      W = window.innerWidth; H = window.innerHeight;
      mobile = W < 820; bandH = mobile ? Math.round(H * 0.4) : 0;
      document.documentElement.style.setProperty('--band', bandH ? bandH + 'px' : '40vh');
      const r = canvas.getBoundingClientRect();
      cw = Math.round(r.width); ch = Math.round(r.height); cvLeft = r.left; cvTop = r.top;
      R.resize(cw, ch, window.devicePixelRatio || 1);
      svg.setAttribute('viewBox', `0 0 ${W} ${H}`);
      lands.forEach((o) => { o.el.style.transform = ''; });
      words.forEach((e) => { e.style.transform = ''; });
      L = readLayout();
      const top = (el) => el.getBoundingClientRect().top + window.scrollY;
      lands.forEach((o) => { o.top = top(o.el); });
      callouts.forEach((c) => {
        const rc = c.el.getBoundingClientRect();
        c.docTop = rc.top + window.scrollY; c.right = rc.right; c.h = rc.height; c.sticky = !!c.el.closest('[data-sticky]');
      });
      dirty = true;
      if (STATIC) invalidate();
    }

    const dash = (c, a, d) => {
      c.hl.setAttribute('d', d); c.p.setAttribute('d', d);
      const l = c.p.getTotalLength() + 1;
      for (const n of [c.p, c.hl]) { n.style.visibility = 'visible'; n.style.strokeDasharray = `${l} ${l}`; n.style.strokeDashoffset = (l * (1 - a)).toFixed(1); }
    };

    function updateDOM(s, y) {
      const Vh = s.Vh || H, top = s.top || 0;
      if (!STATIC) {
        for (const o of lands) {
          const p = clamp((top + Vh * 0.95 - (o.top - y)) / (Vh * 0.32));
          const e = 1 - Math.pow(1 - p, 3);
          o.el.style.opacity = (o.hero ? Math.min(e, clamp(introT * 1.2)) : e).toFixed(3);
          o.el.style.transform = `translateY(${((1 - e) * 28).toFixed(1)}px)`;
        }
        const P = s.P;
        steps.forEach((li, i) => {
          const raw = sm(1 - Math.abs(P * 4 - (i + 0.5)) * 1.25);
          li.style.setProperty('--on', raw.toFixed(3));
          if (sdp[i]) sdp[i].style.setProperty('--on', clamp((raw - 0.55) * 2.4).toFixed(3));
        });
        if (roEl) {
          const idx = Math.min(3, Math.floor(P * 4));
          const nm = ['MAP', 'PROTOTYPE', 'SHIP', 'HAND OVER'][idx];
          const html = `STAGE <b>0${idx + 1}</b> / 04 · ${nm}`;
          if (roEl.innerHTML !== html) roEl.innerHTML = html;
        }
        rows.forEach((r, i) => {
          const cur = Math.floor(s.pr * 4) === i;
          r.style.setProperty('--lit', (s.pr <= 0.01 ? 0 : cur ? 1 : (s.pr * 4 > i ? 0.55 : 0)).toFixed(2));
        });
        words.forEach((w, i) => {
          const p = sm(lin(s.cl, 0.5 + i * 0.05, 0.64 + i * 0.05));
          w.style.opacity = p.toFixed(3); w.style.transform = `translateY(${((1 - p) * 34).toFixed(1)}px)`;
        });
        if (cc) { const cp = sm(lin(s.cl, 0.8, 0.92)); cc.style.opacity = cp.toFixed(3); cc.style.transform = `translateY(${((1 - cp) * 16).toFixed(1)}px)`; }
      }
    }

    function leaders(s) {
      const Vh = s.Vh || H, top = s.top || 0;
      for (const c of callouts) {
        const ty = c.sticky ? c.el.getBoundingClientRect().top : c.docTop - window.scrollY;
        const cy = ty + c.h / 2;
        let target;
        if (STATIC) target = 0;
        else if (c.isRow) target = s.pr > 0 && s.pr < 1 && c.el === rows[Math.min(3, Math.floor(s.pr * 4))] ? 1 : 0;
        else if (c.el.hasAttribute('data-ro')) target = s.P > 0 && s.P < 1 && s.pe >= 1 ? 1 : 0;
        else target = sm(clamp((1 - Math.abs(cy - (top + Vh * 0.5)) / (Vh * 0.42)) * 2.2));
        // no leaders while the machine is hidden (Work, Notes), or from text that has left the screen
        target *= 1 - (s.hide || 0);
        if (cy < 72 || cy > Vh - 8) target = 0;
        c.a += (target - c.a) * 0.18; if (Math.abs(target - c.a) < 0.003) c.a = target;
        const a = c.a;
        if (a < 0.01) { c.p.style.visibility = 'hidden'; c.hl.style.visibility = 'hidden'; c.c.style.opacity = 0; continue; }
        const an = R.anchors[c.anchor]; if (!an) continue;
        const px = cvLeft + an[0], py = cvTop + an[1];
        if (mobile) {
          dash(c, cy < bandH + 14 ? 0 : a, `M11 ${cy - 15} V${cy + 15}`);
          c.c.setAttribute('cx', px); c.c.setAttribute('cy', py); c.c.setAttribute('r', 9 + (1 - a) * 8); c.c.style.opacity = a; c.c.style.fill = 'none';
          continue;
        }
        c.c.setAttribute('r', 3.2); c.c.style.fill = '#0a0a0b';
        const x0 = c.right + 12;
        let jx = px - Math.abs(py - cy);
        if (jx < x0 + 40) jx = x0 + 40;
        dash(c, a, `M${x0} ${cy} H${jx} L${px} ${py}`);
        c.c.setAttribute('cx', px); c.c.setAttribute('cy', py); c.c.style.opacity = clamp((a - 0.85) * 7);
      }
    }

    function frame(t) {
      const y = window.scrollY;
      if (snapNext || STATIC) { shown = y; snapNext = false; }
      else { shown += (y - shown) * 0.18; if (Math.abs(y - shown) < 0.3) shown = y; }
      if (introT < 1) introT = Math.min(1, introT + Math.max(0, t - lastT) / 1.4);
      lastT = t;
      const s = homeState(shown, L, { mobile, bandH, H, static: STATIC });
      for (let g = 0; g < 4; g++) hl[g] += ((s.hlg === g ? 1 : 0) - hl[g]) * 0.14;
      s.hl = hl;
      s.mobile = mobile; s.mAlpha = s.mAlpha * (STATIC ? 1 : sm(introT));
      frameN++;
      const moving = Math.abs(shown - lastShown) > 0.01;
      if (moving || introT < 1 || dirty || (!STATIC && (frameN & 1) === 0)) {
        R.draw(s, homeView(s, cw, ch, R.dpr, mobile, t), t);
        lastShown = shown; dirty = false;
      }
      updateDOM(s, shown);
      leaders(s);
    }

    layout();
    const qy = initialScrollY();
    if (qy != null) { window.scrollTo({ top: qy, left: 0, behavior: 'instant' }); shown = window.scrollY; introT = 1; snapNext = true; }
    else shown = window.scrollY;
    // snap eased callout values for ?y screenshots
    if (qy != null) { const s0 = homeState(shown, L, { mobile, bandH, H, static: STATIC }); for (let g = 0; g < 4; g++) hl[g] = s0.hlg === g ? 1 : 0; }

    const off = onFrame(frame);
    const onResize = () => layout();
    window.addEventListener('resize', onResize);
    window.addEventListener('load', onResize);
    const ro = typeof ResizeObserver === 'function' ? new ResizeObserver(() => layout()) : null;
    ro?.observe(document.body);
    document.fonts?.ready.then(layout);

    return () => {
      off();
      window.removeEventListener('resize', onResize);
      window.removeEventListener('load', onResize);
      ro?.disconnect();
      callouts.forEach((c) => c.g.remove());
    };
  }, []);

  return (
    <>
      <canvas id="stage" ref={canvasRef} aria-hidden="true" />
      <svg id="leaders" ref={svgRef} aria-hidden="true" />
    </>
  );
}
