import revenue from './revenue';
import activeUsers from './activeUsers';
import salaries from './salaries';
import skus from './skus';

const ASKER = { name: 'J. Ortiz', role: 'EMEA operations manager' };

export const SCENARIO_LIST = [revenue, activeUsers, salaries, skus].map((s) => ({ ...s, asker: ASKER }));
export const SCENARIO_BY_ID = Object.fromEntries(SCENARIO_LIST.map((s) => [s.id, s]));
