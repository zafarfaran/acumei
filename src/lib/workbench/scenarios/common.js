// Steps every scenario shares. Each takes the engine ctx and emits one event
// (or none, when the branch isn't fitted). Scenario files call these in rail
// order and add their own query, validation and answer.

const ASKER = 'j.ortiz';

export function intake(ctx) {
  const { label, where } = ctx.channel;
  ctx.emit({
    step: 'D-01', kind: 'intake', verdict: 'pass',
    summary: `“${ctx.scenario.question}” from J. Ortiz via ${label}`,
    reasoning: `Asked in ${where} by J. Ortiz, EMEA operations manager (role emea_manager).`,
    audit: `intake    ${where.padEnd(10)} ${ASKER}`,
  });
}

export function shortcutNote(ctx, slot) {
  return { 'F-05': 'No metric definitions: the agent has to guess from column names.', 'F-07': 'Every query runs with full warehouse access, whoever asks.', 'F-12': 'No checks: whatever the query returns goes out.' }[ctx.part(slot)];
}

export function clarifyPass(ctx, why) {
  if (!ctx.has('G-01')) return;
  ctx.emit({ step: 'G-01', kind: 'guard', verdict: 'pass', summary: why, audit: 'clarify   not needed' });
}

// Returns false (and has emitted a blocked event) when the asker can't see the data.
export function access(ctx, { restricted = false, table }) {
  if (ctx.part('D-03') === 'F-07') {
    ctx.emit({
      step: 'D-03', kind: 'access', verdict: 'flagged',
      summary: `Runs as svc_analytics: can read every table${restricted ? `, including ${table}` : ''}`,
      reasoning: `${shortcutNote(ctx, 'D-03')} J. Ortiz's own role would ${restricted ? 'not be allowed to read ' + table : 'only see EMEA rows'}.`,
      audit: `access    svc_analytics (full)`,
    });
    return true;
  }
  if (restricted) {
    ctx.emit({
      step: 'D-03', kind: 'access', verdict: 'blocked',
      summary: `Denied: role emea_manager has no grant on ${table}`,
      reasoning: 'The agent runs as the person asking, so it inherits their permissions. HR data is restricted to the People team.',
      audit: `access    DENIED ${table} for ${ASKER}`,
    });
    return false;
  }
  ctx.emit({
    step: 'D-03', kind: 'access', verdict: 'pass',
    summary: 'Runs as J. Ortiz (emea_manager): EMEA rows only',
    reasoning: 'A row-level policy adds region = \'EMEA\' to every query this role runs.',
    audit: `access    ${ASKER} · rows ∩ region=EMEA`,
  });
  return true;
}

// Returns false when the gate is waiting or was denied.
export function costGate(ctx, gb) {
  if (!ctx.has('G-03')) return true;
  const cost = ctx.connector.cost(gb);
  if (gb <= 500) {
    ctx.emit({ step: 'G-03', kind: 'guard', verdict: 'pass', summary: `Estimated scan ${fmtGb(gb)}, under the 500 GB limit`, audit: `cost      est ${fmtGb(gb)} ok` });
    return true;
  }
  const c = ctx.pause({
    step: 'G-03', id: 'cost',
    prompt: `Estimated scan ${fmtGb(gb)} (${cost}) is over the 500 GB limit. Approve it?`,
    options: [{ id: 'approve', label: 'Approve the scan' }, { id: 'deny', label: 'Deny' }],
    audit: `cost      est ${fmtGb(gb)} held for approval`,
  });
  return c === 'approve' ? true : c === 'deny' ? 'denied' : false;
}

export function piiPass(ctx) {
  if (!ctx.has('G-02')) return;
  ctx.emit({ step: 'G-02', kind: 'guard', verdict: 'pass', summary: 'No personal fields in the result', audit: 'pii       none found' });
}

export function passThrough(ctx) {
  ctx.emit({ step: 'D-05', kind: 'validate', verdict: 'flagged', summary: 'Pass-through: no checks run, the result goes out as-is', reasoning: shortcutNote(ctx, 'D-05'), audit: 'validate  skipped (pass-through)' });
}

// Analyst review. `why` set → the answer is exec-bound or low-confidence and is held.
// Returns 'approve' | 'reject' | null (waiting) | 'skip' (not fitted or not needed).
export function review(ctx, why) {
  if (!ctx.has('G-04')) return 'skip';
  if (!why) {
    ctx.emit({ step: 'G-04', kind: 'guard', verdict: 'pass', summary: 'Not exec-bound and confidence is high: no review needed', audit: 'review    not required' });
    return 'skip';
  }
  return ctx.pause({
    step: 'G-04', id: 'review', prompt: `${why} An analyst reviews it before it is posted.`,
    options: [{ id: 'approve', label: 'Analyst approves' }, { id: 'reject', label: 'Analyst sends it back' }],
    audit: 'review    held for analyst',
  });
}

const DELIVERY = {
  'F-13': (to) => ({ format: 'Slack memo + chart', line: `Posted a memo and chart to ${to}` }),
  'F-14': () => ({ format: 'Dashboard tile', line: 'Updated the tile on the ops dashboard' }),
  'F-15': () => ({ format: 'Board slide draft', line: 'Drafted a slide for the October board pack' }),
};

export function deliver(ctx, { to, rejected = false, leaked = false }) {
  const d = DELIVERY[ctx.part('D-06')](to);
  if (rejected) {
    ctx.emit({ step: 'D-06', kind: 'deliver', verdict: 'blocked', summary: 'Sent back by the analyst: nothing was posted', audit: 'deliver   withheld' });
    return { to, format: d.format, posted: false };
  }
  ctx.emit({
    step: 'D-06', kind: 'deliver', verdict: leaked ? 'leaked' : 'pass',
    summary: leaked ? `${d.line}, including personal data` : d.line,
    audit: `deliver   ${d.format.toLowerCase()} → ${to}`,
  });
  return { to, format: d.format, posted: true };
}

export const fmtGb = (gb) => (gb >= 1000 ? `${(gb / 1000).toFixed(1)} TB` : `${gb} GB`);
export const fmtPct = (p) => `${p < 0 ? '−' : '+'}${Math.abs(Math.round(p))}%`;
export const fmtInt = (n) => n.toLocaleString('en-GB');
