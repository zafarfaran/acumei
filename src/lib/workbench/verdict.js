// The one-line verdict on a run, in plain words, for the result banner.
// tone: 'bad' (it went wrong), 'good' (a guardrail or check saved it),
// 'wait' (paused for a choice).

export function verdictOf(events) {
  if (!events?.length) return null;
  const last = events[events.length - 1];
  const at = (step) => events.find((e) => e.step === step && e.kind !== 'answer');
  const answer = last.kind === 'answer' ? last.answer : null;

  if (last.kind === 'pause') {
    return { tone: 'wait', title: 'Paused. It wants a decision before it carries on.', detail: last.pause.prompt };
  }
  if (last.kind === 'error') return { tone: 'bad', title: 'The run stopped.', detail: last.summary };
  if (!answer) return null;

  // bad outcomes, worst first
  if (events.some((e) => e.verdict === 'leaked')) {
    return { tone: 'bad', title: answer.delivered?.posted ? 'It leaked 12 people’s salaries into Slack.' : 'Personal data reached the agent.', detail: answer.flagged };
  }
  const q = at('D-04');
  if (q?.verdict === 'flagged' && /\$/.test(q.summary)) {
    const cost = q.summary.match(/≈ \$[\d.]+/)?.[0] || 'money';
    return { tone: 'bad', title: `It spent ${cost.replace('≈ ', '')} on one query and nobody approved it.`, detail: answer.contrast };
  }
  if (answer.flagged && /Ambiguous/.test(answer.flagged)) {
    return { tone: 'bad', title: 'It had to guess what you meant, and guessed wrong.', detail: answer.flagged };
  }
  if (answer.flagged) return { tone: 'bad', title: 'It sent the wrong number to the exec channel.', detail: answer.flagged };

  // good outcomes: name what saved it
  if (at('D-03')?.verdict === 'blocked') return { tone: 'good', title: 'Refused. The agent can’t see salary data, so nothing leaked.', detail: answer.text };
  if (at('G-02')?.rows?.masked?.length) return { tone: 'good', title: 'Names were hidden. Only averages went out.', detail: answer.contrast };
  if (at('D-05')?.verdict === 'fixed') return { tone: 'good', title: 'Caught it. The checks found a bad number and fixed it.', detail: answer.contrast };
  if (at('G-01')?.pause?.chosen) return { tone: 'good', title: 'It asked which one you meant instead of guessing.', detail: answer.contrast };
  if (at('G-03')?.pause?.chosen === 'approve') return { tone: 'good', title: 'It asked before spending the money.', detail: answer.contrast };
  if (at('G-03')?.pause?.chosen === 'deny' || at('D-04')?.verdict === 'blocked') return { tone: 'good', title: 'It didn’t run the expensive query.', detail: answer.text };
  if (answer.delivered && !answer.delivered.posted) return { tone: 'good', title: 'An analyst held it back before it was posted.', detail: answer.contrast };
  return { tone: 'good', title: 'Checked and delivered.', detail: answer.contrast };
}
