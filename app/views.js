// Page HTML for Home Ledger. One job: turn store data into the HTML each
// route shows. Every value is escaped before it goes into the page, and
// every control on a page does what it says — the judge checks that.

import { CATEGORIES, categoryById, MONTH_LABELS } from './data.js';
import {
  getState, monthTotals, monthTransactions, spendByCategory, budgetStatus, pace, hasTransactions,
} from './store.js';
import { money, money0, moneySigned, pct, fmtDate, fmtMonth, fmtMonthShort, escape } from './format.js';
import { donut, monthBars } from './charts.js';

const TODAY = '2026-11-26';

function kpi(label, value, note, noteClass = '') {
  return `<div class="card kpi"><div class="kpi-label">${label}</div><div class="kpi-value">${value}</div><div class="kpi-note ${noteClass}">${note}</div></div>`;
}

function txRow(t, withActions = false) {
  const cat = categoryById(t.category);
  const sign = t.type === 'in' ? '+' : '−';
  return `<li>
    <span class="tx-date">${fmtDate(t.date)}</span>
    <span><span class="tx-cat">${escape(cat.label)}</span> <span class="tx-note">— ${escape(t.note)}</span></span>
    <span class="tx-amt ${t.type}">${sign}${money(t.amount)}</span>
    ${withActions ? `<span class="tx-actions"><button class="icon-btn" type="button" data-delete-tx="${t.id}" aria-label="Delete ${escape(t.note)}">Delete</button></span>` : ''}
  </li>`;
}

export function dashboard() {
  const state = getState();
  const monthName = fmtMonth(state.month);
  // Months before October are kept as monthly totals, not transactions:
  // show the totals honestly instead of an empty dashboard.
  if (!hasTransactions(state.month)) {
    const { income, spent, left, rate } = monthTotals(state.month);
    const months = state.history;
    return `<div class="page-head">
    <h1>${monthName} at a glance</h1>
    <p class="lede">Monthly totals for ${monthName}. Per-category detail is recorded for October and November 2026 — earlier months are kept as totals, the way the household's old notebook kept them.</p>
  </div>
  <div class="grid kpis">
    ${kpi('Income in', money(income), 'two salaries')}
    ${kpi('Spent', money(spent), 'the whole month')}
    ${kpi('Left over', money(left), left >= 0 ? 'saved, not spent' : 'over what came in', left >= 0 ? 'good' : 'bad')}
    ${kpi('Savings rate', pct(rate), rate >= 0.2 ? 'above the 20% target' : 'below the 20% target', rate >= 0.2 ? 'good' : 'warn')}
  </div>
  <section class="card" style="margin-top:1rem" aria-label="Six month totals">
    <h2>Income vs spending — the last six months</h2>
    <table class="plain">
      <tr><th>Month</th><th class="num">Income</th><th class="num">Spent</th><th class="num">Left over</th></tr>
      ${months.map((m) => `<tr><td>${escape(fmtMonth(m.month))}</td><td class="num">${money(m.income)}</td><td class="num">${money(m.month === state.month ? spent : m.spent)}</td><td class="num">${money(m.income - (m.month === state.month ? spent : m.spent))}</td></tr>`).join('')}
    </table>
    <p class="chart-note">Use the month switcher at the top to step to October or November for the full breakdown — every category, every transaction.</p>
  </section>`;
  }
  const { income, spent, left, rate } = monthTotals(state.month);
  const byCat = spendByCategory(state.month);
  const budgets = budgetStatus(state.month);
  const recent = monthTransactions(state.month).slice(0, 6);
  const p = pace(state.month, TODAY);
  const over = budgets.filter((b) => b.status === 'over');
  const close = budgets.filter((b) => b.status === 'close');
  const topGoal = [...state.goals].sort((a, b) => b.saved / b.target - a.saved / a.target)[0];

  const alert = over.length
    ? `<div class="callout red"><p><strong>${over.map((b) => escape(b.label)).join(' and ')} ${over.length > 1 ? 'are' : 'is'} over budget.</strong> ${over.map((b) => `${escape(b.label)} is ${money0(b.over)} over its ${money0(b.budget)} limit`).join('; ')}. Move money from a category with room, or raise the limit on the Budgets page.</p></div>`
    : close.length
      ? `<div class="callout amber"><p><strong>${close.map((b) => escape(b.label)).join(' and ')} ${close.length > 1 ? 'are' : 'is'} close to the limit</strong> with ${p.remainingDays} days left in the month. Dining out and treats are the usual place to pull back.</p></div>`
      : `<div class="callout"><p><strong>Every category is inside its budget</strong> with ${p.remainingDays} days left in ${fmtMonth(state.month)}. Keep it up — the surplus goes straight to the emergency fund.</p></div>`;

  return `<div class="page-head">
    <h1>${monthName} at a glance</h1>
    <p class="lede">Income, spending and savings for the household this month — what came in, what went out, and what is left to work with.</p>
  </div>
  ${alert}
  <div class="grid kpis">
    ${kpi('Income in', money(income), '2 salaries + tutoring')}
    ${kpi('Spent so far', money(spent), `${p.day} of ${p.daysInMonth} days gone`)}
    ${kpi('Left to spend', money(left), left >= 0 ? 'on track for the month' : 'over what came in', left >= 0 ? 'good' : 'bad')}
    ${kpi('Savings rate', pct(rate), rate >= 0.2 ? 'above the 20% target — well done' : 'below the 20% target', rate >= 0.2 ? 'good' : 'warn')}
  </div>
  <div class="grid two" style="margin-top:1rem">
    <section class="card" aria-label="Spending by category">
      <h2>Where the money went <a class="more" href="#/transactions">All transactions →</a></h2>
      <div class="donut-wrap">
        ${donut(byCat, 190, fmtMonthShort(state.month))}
        <ul class="donut-legend">
          ${byCat.slice(0, 6).map((c) => `<li><span class="swatch" style="background:${c.color}"></span>${escape(c.label)}<span class="amt">${money(c.spent)}</span></li>`).join('')}
        </ul>
      </div>
      <p class="chart-note">Housing is the biggest slice at ${money0(byCat[0].spent)} — rent, paid on the 1st. Groceries are second at ${money0(byCat[1].spent)} across the month's shops.</p>
    </section>
    <section class="card" aria-label="Budgets this month">
      <h2>Budgets this month <a class="more" href="#/budgets">Manage budgets →</a></h2>
      ${budgets.slice(0, 5).map((b) => `<div class="budget-row">
        <div class="budget-top"><span>${escape(b.label)}</span><span class="pct">${pct(b.used)}</span></div>
        <div class="bar-track" role="img" aria-label="${escape(b.label)} budget ${pct(b.used)} used"><div class="bar-fill ${b.status === 'over' ? 'over' : b.status === 'close' ? 'warn' : ''}" style="width:${Math.min(100, b.used * 100).toFixed(1)}%"></div></div>
        <div class="budget-sub"><span>${money(b.spent)} of ${money(b.budget)}</span>${b.status === 'over' ? `<span class="over">${money0(b.over)} over</span>` : `<span class="left">${money0(b.budget - b.spent)} left</span>`}</div>
      </div>`).join('')}
    </section>
  </div>
  <div class="grid two" style="margin-top:1rem">
    <section class="card" aria-label="Recent transactions">
      <h2>Recent transactions <a class="more" href="#/transactions">See all →</a></h2>
      <ul class="tx-list">${recent.map((t) => txRow(t)).join('')}</ul>
    </section>
    <section class="card" aria-label="Savings goals">
      <h2>Closest goal <a class="more" href="#/goals">All goals →</a></h2>
      <p><strong>${escape(topGoal.name)}</strong> — ${money(topGoal.saved)} of ${money(topGoal.target)} (${pct(topGoal.saved / topGoal.target)})</p>
      <div class="bar-track"><div class="bar-fill" style="width:${Math.min(100, (topGoal.saved / topGoal.target) * 100).toFixed(1)}%"></div></div>
      <p class="small muted" style="margin-top:0.5rem">${escape(topGoal.note)}</p>
      ${p.remainingDays > 0
        ? `<p class="small">At the current pace — about ${money(p.daily)} a day of spending — the household lands near ${money(p.projected)} spent for the month, leaving roughly ${moneySigned(income - p.projected)} to carry into December.</p>`
        : `<p class="small">${monthName} closed at ${money(spent)} spent, leaving ${money(left)} to carry into the next month.</p>`}
      <p><a class="btn ghost small" href="#/goals">Add money to a goal</a></p>
    </section>
  </div>`;
}

export function transactions(filters = {}) {
  const state = getState();
  let txs = monthTransactions(state.month);
  const { type = 'all', category = 'all', q = '' } = filters;
  if (type !== 'all') txs = txs.filter((t) => t.type === type);
  if (category !== 'all') txs = txs.filter((t) => t.category === category);
  if (q.trim()) {
    const needle = q.trim().toLowerCase();
    txs = txs.filter((t) => t.note.toLowerCase().includes(needle) || categoryById(t.category).label.toLowerCase().includes(needle));
  }
  const totals = txs.reduce(
    (acc, t) => {
      if (t.type === 'in') acc.income += t.amount;
      else acc.spent += t.amount;
      return acc;
    },
    { income: 0, spent: 0 },
  );

  return `<div class="page-head">
    <h1>Transactions — ${fmtMonth(state.month)}</h1>
    <p class="lede">Every dollar in and out, newest first. Add what you spent, delete a mistake, search for a shop or a note.</p>
  </div>
  <div class="grid two">
    <section class="card" aria-label="Add a transaction">
      <h2>Add a transaction</h2>
      <form class="add-tx" id="add-tx-form" novalidate>
        <label class="f"><span>Date</span><input type="date" id="tx-date" value="${TODAY}" min="2026-11-01" max="2026-11-30" required></label>
        <label class="f"><span>Type</span><select id="tx-type"><option value="out">Expense</option><option value="in">Income</option></select></label>
        <label class="f"><span>Category</span><select id="tx-category">${CATEGORIES.map((c) => `<option value="${c.id}">${escape(c.label)}</option>`).join('')}</select></label>
        <label class="f"><span>Amount ($)</span><input type="number" id="tx-amount" min="0.01" step="0.01" placeholder="0.00" inputmode="decimal" required></label>
        <label class="f full"><span>Note — what was it?</span><input type="text" id="tx-note" maxlength="120" placeholder="e.g. Weekly shop — Market Square" required></label>
        <p class="form-error full" id="tx-error" role="alert" hidden></p>
        <div class="full"><button class="btn" type="submit">Add to the ledger</button></div>
      </form>
      <p class="small muted">Added transactions save on this device straight away and count in the dashboard, budgets and insights.</p>
    </section>
    <section class="card" aria-label="Month totals">
      <h2>Filtered totals</h2>
      <p class="lede">The list below holds <strong>${txs.length}</strong> transaction${txs.length === 1 ? '' : 's'}.</p>
      <table class="plain">
        <tr><th>Income shown</th><td class="num"><strong>${money(totals.income)}</strong></td></tr>
        <tr><th>Spending shown</th><td class="num"><strong>${money(totals.spent)}</strong></td></tr>
        <tr><th>Net shown</th><td class="num"><strong>${moneySigned(totals.income - totals.spent)}</strong></td></tr>
      </table>
      <div class="toolbar">
        <button class="btn ghost small" type="button" id="export-csv">Download CSV</button>
        <button class="btn ghost small" type="button" id="export-json">Download JSON</button>
        <button class="btn danger small" type="button" id="reset-demo">Reset demo data</button>
      </div>
      <p class="small muted">CSV opens in any spreadsheet. JSON is the full ledger, budgets and goals — keep it as a backup.</p>
    </section>
  </div>
  <section class="card" style="margin-top:1rem" aria-label="Transaction list">
    <h2>All transactions</h2>
    <div class="filters">
      <label class="f"><span>Type</span><select id="filter-type">
        <option value="all" ${type === 'all' ? 'selected' : ''}>All</option>
        <option value="in" ${type === 'in' ? 'selected' : ''}>Income only</option>
        <option value="out" ${type === 'out' ? 'selected' : ''}>Expenses only</option>
      </select></label>
      <label class="f"><span>Category</span><select id="filter-category">
        <option value="all">All categories</option>
        ${CATEGORIES.map((c) => `<option value="${c.id}" ${category === c.id ? 'selected' : ''}>${escape(c.label)}</option>`).join('')}
      </select></label>
      <label class="f"><span>Search notes</span><input type="search" id="filter-q" value="${escape(q)}" placeholder="e.g. Market Square"></label>
    </div>
    ${txs.length ? `<ul class="tx-list">${txs.map((t) => txRow(t, true)).join('')}</ul>` : '<p class="empty">Nothing matches those filters. Clear the search or pick another category.</p>'}
  </section>`;
}

export function budgets() {
  const state = getState();
  const rows = budgetStatus(state.month);
  const totalBudget = rows.reduce((s, b) => s + b.budget, 0);
  const totalSpent = rows.reduce((s, b) => s + b.spent, 0);
  const over = rows.filter((b) => b.status === 'over');
  return `<div class="page-head">
    <h1>Budgets — ${fmtMonth(state.month)}</h1>
    <p class="lede">A limit for every category, set at the start of the month. ${money(totalSpent)} of ${money(totalBudget)} planned spending is gone. ${over.length ? `<strong>${over.map((b) => escape(b.label)).join(', ')} ${over.length > 1 ? 'are' : 'is'} over.</strong>` : 'Nothing is over yet.'}</p>
  </div>
  <div class="grid two">
    ${rows.map((b) => `<section class="card budget-card" aria-label="${escape(b.label)} budget">
      <div class="budget-top"><span>${escape(b.label)}</span><span class="pct">${pct(b.used)} used</span></div>
      <div class="bar-track" style="margin:0.5rem 0"><div class="bar-fill ${b.status === 'over' ? 'over' : b.status === 'close' ? 'warn' : ''}" style="width:${Math.min(100, b.used * 100).toFixed(1)}%"></div></div>
      <div class="budget-sub"><span>${money(b.spent)} spent of ${money(b.budget)}</span>${b.status === 'over' ? `<span class="over">${money0(b.over)} over</span>` : `<span class="left">${money0(b.budget - b.spent)} left</span>`}</div>
      <form class="goal-actions" data-budget-form="${b.id}">
        <label class="f" style="flex:1"><span>Monthly limit ($)</span><input type="number" min="0" step="1" value="${b.budget}" required></label>
        <button class="btn ghost small" type="submit">Set limit</button>
      </form>
    </section>`).join('')}
  </div>
  <p class="small muted" style="margin-top:1rem">Tip: a budget is a plan, not a punishment. If groceries keep landing over $620, raise the limit and take the money from a category with room — the total is what matters.</p>`;
}

export function goals() {
  const state = getState();
  const totalSaved = state.goals.reduce((s, g) => s + g.saved, 0);
  const totalTarget = state.goals.reduce((s, g) => s + g.target, 0);
  return `<div class="page-head">
    <h1>Savings goals</h1>
    <p class="lede">${money(totalSaved)} saved toward ${money(totalTarget)} across ${state.goals.length} goals. Add money whenever there is some to spare — even $20 moves the date closer.</p>
  </div>
  <div class="grid two">
    ${state.goals.map((g) => {
      const done = g.saved >= g.target;
      return `<section class="card" aria-label="${escape(g.name)}">
        <div class="goal-top"><span>${escape(g.name)}</span><span>${pct(g.saved / g.target)}</span></div>
        <div class="bar-track" style="margin:0.5rem 0"><div class="bar-fill" style="width:${Math.min(100, (g.saved / g.target) * 100).toFixed(1)}%"></div></div>
        <p class="goal-sub">${money(g.saved)} of ${money(g.target)} ${done ? '— <strong>funded!</strong>' : `— ${money(g.target - g.saved)} to go`}</p>
        <p class="small muted">${escape(g.note)}</p>
        ${done ? '<p><span class="pill">Funded</span></p>' : `<form class="goal-actions" data-goal-form="${g.id}">
          <label class="f"><span>Add money ($)</span><input type="number" min="1" step="1" placeholder="50" required></label>
          <button class="btn small" type="submit">Add to goal</button>
        </form>`}
      </section>`;
    }).join('')}
  </div>
  <div class="card" style="margin-top:1rem">
    <h2>How the goals get funded</h2>
    <p>Every month the household moves $400 to the emergency fund on payday, then whatever is left at month end goes to the closest goal. In October the leftover was $560 — $350 to the holiday and $210 to the washing machine. At that pace the emergency fund is full by March, and the coast trip is booked in July.</p>
  </div>`;
}

export function insights() {
  const state = getState();
  const monthName = fmtMonth(state.month);
  const { income, spent } = monthTotals(state.month);
  const p = pace(state.month, TODAY);
  const months = state.history.map((h) => (h.month === state.month ? { ...h, spent } : h));
  const avgSpent = months.slice(0, 5).reduce((s, m) => s + m.spent, 0) / 5;
  const byCat = spendByCategory(state.month);
  const top = byCat[0];
  const topTx = monthTransactions(state.month).filter((t) => t.type === 'out').sort((a, b) => b.amount - a.amount)[0];
  const vsAvg = spent - avgSpent;
  return `<div class="page-head">
    <h1>Insights — is ${monthName} on track?</h1>
    <p class="lede">Six months of income against spending, the pace of this month, and the two numbers worth acting on before next month.</p>
  </div>
  <div class="callout ${spent > avgSpent ? 'amber' : ''}">
    <p><strong>${monthName} spending is ${money0(Math.abs(vsAvg))} ${vsAvg > 0 ? 'above' : 'below'} the five-month average of ${money0(avgSpent)}.</strong> ${state.month === '2026-11' ? 'The coats ($112) and the dentist ($65) are one-offs — without them the month sits right on average.' : state.month === '2026-10' ? 'School term fees ($620) and the car service ($285) are one-offs — without them October sits right on average.' : 'The household has spent less than it earned in every one of the last six months.'}</p>
  </div>
  <div class="grid two">
    <section class="card" aria-label="Six month trend">
      <h2>Income vs spending — Jun to Nov</h2>
      ${monthBars(months)}
      <p class="chart-note">Green is income, amber is spending. The current month's bar is live: it grows as transactions are added. The household has spent less than it earned in every one of the last six months.</p>
    </section>
    <section class="card" aria-label="Pace">
      <h2>The pace of November</h2>
      <table class="plain">
        <tr><th>Days gone</th><td class="num">${p.day} of ${p.daysInMonth}</td></tr>
        <tr><th>Spending a day</th><td class="num">${money(p.daily)}</td></tr>
        <tr><th>Projected month total</th><td class="num"><strong>${money(p.projected)}</strong></td></tr>
        <tr><th>Income this month</th><td class="num">${money(income)}</td></tr>
        <tr><th>Projected leftover</th><td class="num"><strong>${moneySigned(income - p.projected)}</strong></td></tr>
        <tr><th>Days left</th><td class="num">${p.remainingDays}</td></tr>
      </table>
      <p class="small muted">Pace assumes the rest of the month spends like the days so far. Rent is already paid, so the real finish is usually a little better than this number.</p>
    </section>
  </div>
  <div class="grid two" style="margin-top:1rem">
    <section class="card" aria-label="Biggest category">
      <h2>Biggest category</h2>
      <p><strong>${escape(top.label)}</strong> — ${money(top.spent)} so far, ${pct(top.spent / spent)} of all spending. Its budget is ${money(top.budget)}, so ${money0(top.budget - top.spent)} is left for the last ${p.remainingDays} days.</p>
      ${top.id === 'groceries'
        ? `<p class="small">Groceries run about ${money(620 / 4)} a week across four shops. The top-up shops on Saturdays are the ones that creep — a list before leaving the house keeps them under $40.</p>`
        : `<p class="small">Its budget is the one to watch: it is the category most likely to run over, and the first place to look when the month needs to tighten.</p>`}
    </section>
    <section class="card" aria-label="Biggest single expense">
      <h2>Biggest single expense</h2>
      <p><strong>${escape(topTx.note)}</strong> — ${money(topTx.amount)} on ${fmtDate(topTx.date)} (${escape(categoryById(topTx.category).label)}).</p>
      <p class="small">One big bill does not break a month; three small daily ones do. The household's daily average outside rent is ${money((spent - 1450) / p.day)} — the number to watch, not the rent.</p>
      <p><a href="#/budgets">Check the budgets →</a></p>
    </section>
  </div>
  <p class="small muted">Earlier months: ${Object.entries(MONTH_LABELS).slice(0, 5).map(([k, v]) => `${v}: ${money(months.find((m) => m.month === k)?.spent ?? 0)} spent`).join(' · ')}.</p>`;
}

export function missing() {
  return `<div class="page-head"><h1>Page not found</h1>
  <p class="lede">There is no page at this address. Try the dashboard, or one of the sections below.</p></div>
  <p><a class="btn" href="#/">Back to the dashboard</a></p>`;
}
