// Seed data for Home Ledger: one household's real November 2026 month, plus the
// six months before it. Every figure is a plausible household figure, not a
// placeholder: two salaries, rent, groceries, school costs and the rest of a
// family of four's month. The app stores its working copy in localStorage;
// this file is only the first-run seed and the "reset demo data" source.

export const CATEGORIES = [
  { id: 'housing', label: 'Housing', color: '#1d4d33' },
  { id: 'groceries', label: 'Groceries', color: '#2a6b47' },
  { id: 'transport', label: 'Transport', color: '#4c8a3f' },
  { id: 'utilities', label: 'Utilities', color: '#7a9e3f' },
  { id: 'dining', label: 'Dining out', color: '#d98a3d' },
  { id: 'entertainment', label: 'Entertainment', color: '#c2700e' },
  { id: 'health', label: 'Health', color: '#8a5a83' },
  { id: 'kids', label: 'Kids & school', color: '#4a7fa5' },
  { id: 'clothing', label: 'Clothing', color: '#a5503c' },
  { id: 'savings', label: 'Savings', color: '#3f6d8e' },
  { id: 'misc', label: 'Everything else', color: '#8a8f88' },
];

export const categoryById = (id) => CATEGORIES.find((c) => c.id === id) ?? CATEGORIES[CATEGORIES.length - 1];

// Monthly budget limits for November 2026 (dollars).
export const BUDGETS_NOV = {
  housing: 1450,
  groceries: 620,
  transport: 310,
  utilities: 285,
  dining: 180,
  entertainment: 120,
  health: 150,
  kids: 340,
  clothing: 120,
  savings: 600,
  misc: 150,
};

// Savings goals: what the household is working toward.
export const GOALS_SEED = [
  { id: 'g-emergency', name: 'Emergency fund', target: 6000, saved: 4150, note: 'Six months of essentials, for the month nobody plans.' },
  { id: 'g-holiday', name: 'Family holiday — coast trip', target: 2400, saved: 980, note: 'Five days by the coast in July, flights booked once the fund clears $1,800.' },
  { id: 'g-washer', name: 'New washing machine', target: 650, saved: 420, note: 'The old one leaks a little more every month. Replace before it floods the kitchen.' },
];

// October 2026 transactions — the month before, kept in full so the month
// switcher shows real figures for October too. Out totals $4,314.00,
// income $4,970.00, matching the history row below.
export const TRANSACTIONS_OCT = [
  { id: 'o01', date: '2026-10-01', type: 'in', category: 'misc', note: 'Salary — Ada (nursing, September pay)', amount: 2850 },
  { id: 'o02', date: '2026-10-01', type: 'out', category: 'housing', note: 'Rent — October', amount: 1450 },
  { id: 'o03', date: '2026-10-03', type: 'out', category: 'groceries', note: 'Weekly shop — Market Square', amount: 152.40 },
  { id: 'o04', date: '2026-10-04', type: 'out', category: 'transport', note: 'Fuel — Shell, full tank', amount: 51.20 },
  { id: 'o05', date: '2026-10-05', type: 'out', category: 'utilities', note: 'Electricity bill — September usage', amount: 128.50 },
  { id: 'o06', date: '2026-10-06', type: 'out', category: 'kids', note: 'School lunch money — both kids, 2 weeks', amount: 86.00 },
  { id: 'o07', date: '2026-10-07', type: 'out', category: 'kids', note: 'School term fees — both kids', amount: 620 },
  { id: 'o08', date: '2026-10-09', type: 'out', category: 'transport', note: 'Bus passes — monthly, both kids', amount: 64.00 },
  { id: 'o09', date: '2026-10-10', type: 'out', category: 'groceries', note: 'Weekly shop — Market Square', amount: 148.90 },
  { id: 'o10', date: '2026-10-12', type: 'out', category: 'transport', note: 'Car service + two tyres', amount: 285 },
  { id: 'o11', date: '2026-10-13', type: 'in', category: 'misc', note: 'Salary — Chidi (teaching, September pay)', amount: 2120 },
  { id: 'o12', date: '2026-10-13', type: 'out', category: 'savings', note: 'Auto-transfer to emergency fund', amount: 400 },
  { id: 'o13', date: '2026-10-15', type: 'out', category: 'misc', note: 'Plumber — fix the kitchen tap', amount: 145 },
  { id: 'o14', date: '2026-10-16', type: 'out', category: 'dining', note: 'Dinner out — Ada’s birthday', amount: 44.25 },
  { id: 'o15', date: '2026-10-17', type: 'out', category: 'groceries', note: 'Weekly shop — Market Square', amount: 141.30 },
  { id: 'o16', date: '2026-10-19', type: 'out', category: 'utilities', note: 'Internet + mobile — October', amount: 89.00 },
  { id: 'o17', date: '2026-10-21', type: 'out', category: 'health', note: 'Pharmacy — cold medicine', amount: 38.40 },
  { id: 'o18', date: '2026-10-24', type: 'out', category: 'groceries', note: 'Weekly shop — Market Square', amount: 139.75 },
  { id: 'o19', date: '2026-10-25', type: 'out', category: 'entertainment', note: 'Cinema — family film', amount: 52.00 },
  { id: 'o20', date: '2026-10-26', type: 'out', category: 'transport', note: 'Fuel — Shell', amount: 47.60 },
  { id: 'o21', date: '2026-10-27', type: 'out', category: 'clothing', note: 'School shoes — both kids', amount: 89.00 },
  { id: 'o22', date: '2026-10-28', type: 'out', category: 'misc', note: 'Gift — nephew’s birthday', amount: 32.00 },
  { id: 'o23', date: '2026-10-29', type: 'out', category: 'utilities', note: 'Water bill', amount: 47.50 },
  { id: 'o24', date: '2026-10-30', type: 'out', category: 'dining', note: 'Takeaway — late night at work', amount: 41.20 },
  { id: 'o25', date: '2026-10-30', type: 'out', category: 'groceries', note: 'Top-up shop — bread, milk', amount: 21.00 },
];

// November 2026 transactions. type: 'in' | 'out'. Amounts in dollars.
export const TRANSACTIONS_NOV = [
  { id: 't01', date: '2026-11-01', type: 'in', category: 'misc', note: 'Salary — Ada (nursing, October pay)', amount: 2850 },
  { id: 't02', date: '2026-11-01', type: 'out', category: 'housing', note: 'Rent — November', amount: 1450 },
  { id: 't03', date: '2026-11-02', type: 'out', category: 'groceries', note: 'Weekly shop — Market Square', amount: 148.20 },
  { id: 't04', date: '2026-11-03', type: 'out', category: 'transport', note: 'Fuel — Shell, full tank', amount: 52.40 },
  { id: 't05', date: '2026-11-04', type: 'out', category: 'utilities', note: 'Electricity bill — October usage', amount: 132.75 },
  { id: 't06', date: '2026-11-05', type: 'out', category: 'kids', note: 'School lunch money — both kids, 2 weeks', amount: 86.00 },
  { id: 't07', date: '2026-11-06', type: 'out', category: 'dining', note: 'Friday pizza night', amount: 38.50 },
  { id: 't08', date: '2026-11-07', type: 'out', category: 'groceries', note: 'Top-up shop — bread, milk, fruit', amount: 41.60 },
  { id: 't09', date: '2026-11-08', type: 'out', category: 'entertainment', note: 'Cinema — two adults, two kids', amount: 46.00 },
  { id: 't10', date: '2026-11-09', type: 'out', category: 'transport', note: 'Bus passes — monthly, both kids', amount: 64.00 },
  { id: 't11', date: '2026-11-10', type: 'out', category: 'groceries', note: 'Weekly shop — Market Square', amount: 156.80 },
  { id: 't12', date: '2026-11-11', type: 'out', category: 'health', note: 'Pharmacy — inhaler refill + vitamins', amount: 42.30 },
  { id: 't13', date: '2026-11-12', type: 'out', category: 'utilities', note: 'Water bill', amount: 48.90 },
  { id: 't14', date: '2026-11-13', type: 'in', category: 'misc', note: 'Salary — Chidi (teaching, October pay)', amount: 2120 },
  { id: 't15', date: '2026-11-13', type: 'out', category: 'savings', note: 'Auto-transfer to emergency fund', amount: 400 },
  { id: 't16', date: '2026-11-14', type: 'out', category: 'kids', note: 'School trip — science museum', amount: 58.00 },
  { id: 't17', date: '2026-11-15', type: 'out', category: 'dining', note: 'Lunch out after church', amount: 52.75 },
  { id: 't18', date: '2026-11-16', type: 'out', category: 'transport', note: 'Fuel — Shell', amount: 48.10 },
  { id: 't19', date: '2026-11-17', type: 'out', category: 'groceries', note: 'Weekly shop — Market Square', amount: 139.45 },
  { id: 't20', date: '2026-11-18', type: 'out', category: 'clothing', note: 'Winter coats — both kids', amount: 112.00 },
  { id: 't21', date: '2026-11-19', type: 'out', category: 'utilities', note: 'Internet + mobile — November', amount: 89.00 },
  { id: 't22', date: '2026-11-20', type: 'out', category: 'entertainment', note: 'Streaming — monthly', amount: 15.99 },
  { id: 't23', date: '2026-11-21', type: 'out', category: 'groceries', note: 'Top-up shop — vegetables, eggs', amount: 36.90 },
  { id: 't24', date: '2026-11-22', type: 'out', category: 'health', note: 'Dentist check-up — Ada', amount: 65.00 },
  { id: 't25', date: '2026-11-23', type: 'out', category: 'misc', note: 'Birthday gift — Grandma', amount: 45.00 },
  { id: 't26', date: '2026-11-24', type: 'out', category: 'groceries', note: 'Weekly shop — Market Square', amount: 151.30 },
  { id: 't27', date: '2026-11-25', type: 'in', category: 'misc', note: 'Freelance — Chidi, weekend tutoring', amount: 230 },
  { id: 't28', date: '2026-11-26', type: 'out', category: 'transport', note: 'Fuel — Shell', amount: 44.80 },
];

// Monthly totals for the six months before November, for the Insights trend.
export const HISTORY = [
  { month: '2026-06', label: 'Jun', income: 4970, spent: 4180 },
  { month: '2026-07', label: 'Jul', income: 5010, spent: 4460 },
  { month: '2026-08', label: 'Aug', income: 4970, spent: 4625 },
  { month: '2026-09', label: 'Sep', income: 5120, spent: 4290 },
  { month: '2026-10', label: 'Oct', income: 4970, spent: 4314 },
  { month: '2026-11', label: 'Nov', income: 5200, spent: 0 }, // Nov spent is computed live
];

export const MONTH_LABELS = {
  '2026-06': 'June 2026',
  '2026-07': 'July 2026',
  '2026-08': 'August 2026',
  '2026-09': 'September 2026',
  '2026-10': 'October 2026',
  '2026-11': 'November 2026',
};

export function seedState() {
  return {
    month: '2026-11',
    transactions: [...TRANSACTIONS_OCT, ...TRANSACTIONS_NOV].map((t) => ({ ...t })),
    budgets: { ...BUDGETS_NOV },
    goals: GOALS_SEED.map((g) => ({ ...g })),
    history: HISTORY.map((h) => ({ ...h })),
  };
}
