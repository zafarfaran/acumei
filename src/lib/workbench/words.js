// Verdicts in plain words, for people who won't read the docs.
export const VERDICT_WORD = {
  pass: 'OK',
  fixed: 'Caught & fixed',
  paused: 'Waiting on you',
  flagged: 'Problem',
  blocked: 'Blocked',
  leaked: 'Leaked',
};
export const verdictWord = (v) => VERDICT_WORD[v] || v || '';
