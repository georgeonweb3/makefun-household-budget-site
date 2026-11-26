// Home Ledger's router and wiring. One job: read the hash route, render the
// page, and attach the controls that page offers (forms, filters, buttons).
// window.__shotReady is false while a page renders and true once it is on
// screen, so a screenshot script knows when to capture.

import { getState, setMonth, addTransaction, deleteTransaction, setBudget, addToGoal, resetDemo, exportCsv, exportJson } from './store.js';
import { fmtMonth } from './format.js';
import { dashboard, transactions, budgets, goals, insights, missing } from './views.js';
import { MONTH_LABELS } from './data.js';

const app = document.getElementById('app');
const monthLabel = document.getElementById('month-label');
const monthPrev = document.getElementById('month-prev');
const monthNext = document.getElementById('month-next');
const navToggle = document.querySelector('.nav-toggle');
const siteNav = document.querySelector('.site-nav');

const MONTHS = Object.keys(MONTH_LABELS).sort();

let filters = { type: 'all', category: 'all', q: '' };

function download(name, text, mime) {
  const blob = new Blob([text], { type: mime });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = name;
  document.body.appendChild(a);
  a.click();
  a.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}

function syncMonthSwitch() {
  const state = getState();
  monthLabel.textContent = fmtMonth(state.month);
  const i = MONTHS.indexOf(state.month);
  monthPrev.disabled = i <= 0;
  monthNext.disabled = i >= MONTHS.length - 1;
}

function render() {
  window.__shotReady = false;
  const state = getState();
  const hash = location.hash || '#/';
  const route = hash.replace(/^#\/?/, '').split('/')[0];
  syncMonthSwitch();

  document.querySelectorAll('[data-nav]').forEach((a) => {
    const name = a.getAttribute('data-nav');
    const active = (route === '' && name === 'dashboard') || route === name;
    if (active) a.setAttribute('aria-current', 'page');
    else a.removeAttribute('aria-current');
  });

  if (route === '' || route === 'dashboard') {
    document.title = 'Home Ledger — the household budget that balances itself';
    app.innerHTML = dashboard();
  } else if (route === 'transactions') {
    document.title = 'Transactions | Home Ledger';
    app.innerHTML = transactions(filters);
    wireTransactions();
  } else if (route === 'budgets') {
    document.title = 'Budgets | Home Ledger';
    app.innerHTML = budgets();
    wireBudgets();
  } else if (route === 'goals') {
    document.title = 'Savings goals | Home Ledger';
    app.innerHTML = goals();
    wireGoals();
  } else if (route === 'insights') {
    document.title = 'Insights | Home Ledger';
    app.innerHTML = insights();
  } else {
    document.title = 'Page not found | Home Ledger';
    app.innerHTML = missing();
  }
  window.scrollTo(0, 0);
  window.__shotReady = true;
}

function wireTransactions() {
  const form = document.getElementById('add-tx-form');
  const error = document.getElementById('tx-error');
  form.addEventListener('submit', (e) => {
    e.preventDefault();
    const date = document.getElementById('tx-date').value;
    const type = document.getElementById('tx-type').value;
    const category = document.getElementById('tx-category').value;
    const amount = Number(document.getElementById('tx-amount').value);
    const note = document.getElementById('tx-note').value;
    if (!date || !note.trim() || !(amount > 0)) {
      error.textContent = 'Fill in a date, a note and an amount above $0.00.';
      error.hidden = false;
      return;
    }
    addTransaction({ date, type, category, note, amount });
    render();
  });

  document.getElementById('filter-type').addEventListener('change', (e) => {
    filters.type = e.target.value;
    render();
  });
  document.getElementById('filter-category').addEventListener('change', (e) => {
    filters.category = e.target.value;
    render();
  });
  document.getElementById('filter-q').addEventListener('input', (e) => {
    filters.q = e.target.value;
    render();
    const q = document.getElementById('filter-q');
    q.focus();
    q.setSelectionRange(q.value.length, q.value.length);
  });

  app.querySelectorAll('[data-delete-tx]').forEach((btn) => {
    btn.addEventListener('click', () => {
      deleteTransaction(btn.getAttribute('data-delete-tx'));
      render();
    });
  });

  document.getElementById('export-csv').addEventListener('click', () => {
    download(`home-ledger-${getState().month}.csv`, exportCsv(getState().month), 'text/csv');
  });
  document.getElementById('export-json').addEventListener('click', () => {
    download('home-ledger-backup.json', exportJson(), 'application/json');
  });
  document.getElementById('reset-demo').addEventListener('click', () => {
    resetDemo();
    filters = { type: 'all', category: 'all', q: '' };
    render();
  });
}

function wireBudgets() {
  app.querySelectorAll('[data-budget-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = Number(form.querySelector('input').value);
      if (!(amount >= 0)) return;
      setBudget(form.getAttribute('data-budget-form'), amount);
      render();
    });
  });
}

function wireGoals() {
  app.querySelectorAll('[data-goal-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const amount = Number(form.querySelector('input').value);
      if (!(amount > 0)) return;
      addToGoal(form.getAttribute('data-goal-form'), amount);
      render();
    });
  });
}

monthPrev.addEventListener('click', () => {
  const i = MONTHS.indexOf(getState().month);
  if (i > 0) {
    setMonth(MONTHS[i - 1]);
    render();
  }
});
monthNext.addEventListener('click', () => {
  const i = MONTHS.indexOf(getState().month);
  if (i < MONTHS.length - 1) {
    setMonth(MONTHS[i + 1]);
    render();
  }
});

navToggle.addEventListener('click', () => {
  const open = siteNav.classList.toggle('open');
  navToggle.setAttribute('aria-expanded', String(open));
});
siteNav.addEventListener('click', (e) => {
  if (e.target.tagName === 'A') {
    siteNav.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
  }
});

window.addEventListener('hashchange', render);
render();
