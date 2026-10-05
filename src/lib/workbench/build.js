// A build is what the visitor has fitted: one part per module slot, plus a sorted
// list of branch codes. It lives in the URL as `?b=F01.F04.F06.F08.F11.F13.G02`.
import { MODULES, BRANCHES, partByCode } from './parts';

export const DEFAULT_BUILD = Object.freeze({
  'D-01': 'F-01', 'D-02': 'F-04', 'D-03': 'F-06', 'D-04': 'F-08', 'D-05': 'F-11', 'D-06': 'F-13',
  branches: Object.freeze([]),
});

export function normalise(build) {
  const out = { branches: [] };
  for (const slot of MODULES) {
    const p = partByCode(build?.[slot]);
    out[slot] = p && p.slot === slot ? p.code : DEFAULT_BUILD[slot];
  }
  const br = Array.isArray(build?.branches) ? build.branches : [];
  out.branches = BRANCHES.filter((c) => br.includes(c));
  return out;
}

export const encodeBuild = (build) => {
  const b = normalise(build);
  return [...MODULES.map((s) => b[s]), ...b.branches].map((c) => c.replace('-', '')).join('.');
};

export function decodeBuild(str) {
  const b = { branches: [] };
  for (const tok of String(str || '').split('.')) {
    const p = partByCode(tok.replace(/^([A-Z])(\d\d)$/, '$1-$2'));
    if (!p) continue;
    if (p.slot === p.code) b.branches.push(p.code);
    else b[p.slot] = p.code;
  }
  return normalise(b);
}

export function fit(build, code) {
  const p = partByCode(code);
  const b = normalise(build);
  if (!p) return b;
  if (p.slot === p.code) return normalise({ ...b, branches: [...b.branches, code] });
  return normalise({ ...b, [p.slot]: code });
}

export function remove(build, code) {
  const b = normalise(build);
  return normalise({ ...b, branches: b.branches.filter((c) => c !== code) });
}

export const hasPart = (build, code) => {
  const p = partByCode(code);
  if (!p) return false;
  return p.slot === p.code ? build.branches.includes(code) : build[p.slot] === code;
};
