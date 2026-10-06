// One-click ways to break the agent, each with the one part that fixes it.
import { DEFAULT_BUILD, fit } from './build';

export const CHALLENGES = [
  {
    id: 'leak', scenario: 'salaries', build: fit(DEFAULT_BUILD, 'F-07'), fix: 'G-02',
    title: 'Make it leak salaries', blurb: 'Give the agent one login that can read everything.', fixLabel: 'Add the PII guard',
  },
  {
    id: 'wrong', scenario: 'revenue', build: fit(DEFAULT_BUILD, 'F-12'), fix: 'F-11',
    title: 'Make it get revenue wrong', blurb: 'Switch off the checks before answers go out.', fixLabel: 'Turn the checks back on',
  },
  {
    id: 'bill', scenario: 'skus', build: DEFAULT_BUILD, fix: 'G-03', fixChoices: { cost: 'approve' },
    title: 'Make it run up a bill', blurb: 'Ask for everything, with no spending limit.', fixLabel: 'Add a cost gate',
  },
  {
    id: 'guess', scenario: 'active-users', build: DEFAULT_BUILD, fix: 'G-01', fixChoices: { clarify: '30d' },
    title: 'Make it guess', blurb: 'Ask a question with two right answers.', fixLabel: 'Let it ask first',
  },
];

export const challengeById = (id) => CHALLENGES.find((c) => c.id === id) || null;
