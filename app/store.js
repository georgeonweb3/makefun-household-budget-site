// Home Ledger's store: one job — hold the household's data, keep it in
// localStorage, and answer the questions the pages ask (totals, per-category
// spend, pace). Nothing here touches the DOM.

import { seedState, CATEGORIES } from './data.js';

const KEY = 'homeledger.v1';

let state = load();

function load() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) {
      const parsed = JSON.parse(raw);
      if (parsed && Array.isArray(parsed.transactions) && parsed.budgets && Array.isArray(parsed.goals)) return parsed;
    }
  } catch {
    // Corrupt storage: fall through to a fresh seed.
  }
  return seedState();
}

export function save() {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // Storage full or unavailable: the page still works for this session.
  }
}

export function resetDemo() {
  state = seedState();
  save();
}

export function getState() {
  return state;
}

export function setMonth(key) {
  state.month = key;
  save();
}

export function monthKeyOf(dateIso) {
  return dateIso.slice(0, 7);
}

export function monthTransactions(monthKey) {
  return state.transactions
    .filter((t) => monthKeyOf(t.date) === monthKey)
    .sort((a, b) => (a.date < b.date ? 1 : a.date > b.date ? -1 : 0));
}

export function hasTransactions(monthKey) {
  return state.transactions.some((t) => monthKeyOf(t.date) === monthKey);
}

export function monthTotals(monthKey) {
  const txs = monthTransactions(monthKey);
  if (txs.length === 0) {
    // Months before October are kept as monthly totals, not transactions.
    const h = state.history.find((row) => row.month === monthKey);
    if (h) {
      const income = h.income;
      const spent = h.spent;
      return { income, spent, left: income - spent, rate: income > 0 ? (income - spent) / income : 0 };
    }
  }
  let income = 0;
  let spent = 0;
  for (const t of txs) {
    if (t.type === 'in') income += t.amount;
    else spent += t.amount;
  }
  return { income, spent, left: income - spent, rate: income > 0 ? (income - spent) / income : 0 };
}

export function spendByCategory(monthKey) {
  const totals = new Map(CATEGORIES.map((c) => [c.id, 0]));
  for (const t of monthTransactions(monthKey)) {
    if (t.type === 'out') totals.set(t.category, (totals.get(t.category) ?? 0) + t.amount);
  }
  return CATEGORIES.map((c) => ({ ...c, spent: totals.get(c.id) ?? 0, budget: state.budgets[c.id] ?? 0 }))
    .filter((c) => c.spent > 0 || c.budget > 0)
    .sort((a, b) => b.spent - a.spent);
}

export function budgetStatus(monthKey) {
  return spendByCategory(monthKey).map((c) => {
    const used = c.budget > 0 ? c.spent / c.budget : 0;
    return {
      ...c,
      used,
      over: c.spent - c.budget,
      status: used > 1 ? 'over' : used >= 0.85 ? 'close' : 'ok',
    };
  });
}

// Spending pace: with N days gone in the month, where will spending land?
// A finished month paces at its own total (every day has gone).
export function pace(monthKey, todayIso) {
  const [y, m] = monthKey.split('-').map(Number);
  const daysInMonth = new Date(y, m, 0).getDate();
  const finished = monthKey < todayIso.slice(0, 7);
  const day = finished ? daysInMonth : Math.min(Number(todayIso.slice(8, 10)), daysInMonth);
  const { spent } = monthTotals(monthKey);
  const daily = day > 0 ? spent / day : 0;
  return { day, daysInMonth, daily, projected: daily * daysInMonth, remainingDays: daysInMonth - day };
}

export function addTransaction({ date, type, category, note, amount }) {
  const id = 't' + Date.now().toString(36) + Math.floor(Math.random() * 1e6).toString(36);
  const tx = { id, date, type, category, note: note.trim(), amount: Math.round(amount * 100) / 100 };
  state.transactions.push(tx);
  save();
  return tx;
}

export function deleteTransaction(id) {
  state.transactions = state.transactions.filter((t) => t.id !== id);
  save();
}

export function updateTransaction(id, patch) {
  const tx = state.transactions.find((t) => t.id === id);
  if (!tx) return;
  Object.assign(tx, patch);
  save();
}

export function setBudget(categoryId, amount) {
  state.budgets[categoryId] = Math.round(amount * 100) / 100;
  save();
}

export function addToGoal(goalId, amount) {
  const goal = state.goals.find((g) => g.id === goalId);
  if (!goal) return;
  goal.saved = Math.min(goal.target, Math.round((goal.saved + amount) * 100) / 100);
  save();
}

export function exportCsv(monthKey) {
  const rows = [['Date', 'Type', 'Category', 'Note', 'Amount']];
  for (const t of monthTransactions(monthKey).slice().reverse()) {
    rows.push([t.date, t.type === 'in' ? 'Income' : 'Expense', t.category, `"${t.note.replace(/"/g, '""')}"`, t.amount.toFixed(2)]);
  }
  return rows.map((r) => r.join(',')).join('\n');
}

export function exportJson() {
  return JSON.stringify(state, null, 2);
}
