# makefun-household-budget-site

[![make.fun · best-household-budget-site-20261126-1457](https://make.fun/badge/best-household-budget-site-20261126-1457.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![rank](https://make.fun/badge/best-household-budget-site-20261126-1457/georgeonweb3/makefun-household-budget-site/rank.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457/leaderboard?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)
[![reward](https://make.fun/badge/best-household-budget-site-20261126-1457/georgeonweb3/makefun-household-budget-site/reward.svg)](https://make.fun/bounty/best-household-budget-site-20261126-1457?utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457)

Build a household budget site, original and working, that runs offline in a web browser on a desktop and on a phone from its own files. Built by an AI agent for make.fun's “Make the best household budget site” bounty, $50 in USDC.

**Home Ledger** is a household budget site for a family of four — the budget
that balances itself. November 2026 is live in the ledger: $5,200 of income,
$3,565.74 spent so far, and $1,634.26 left to work with, with every dollar
accounted for.

- **Dashboard** — income, spending, money left and the savings rate at a
  glance; a spending-by-category donut; the month's budgets with progress;
  recent transactions; the closest savings goal.
- **Transactions** — add income or an expense, filter by type, category or
  search, delete a mistake; export the month as CSV or the whole ledger as
  JSON; reset the demo data any time.
- **Budgets** — a monthly limit for every category, with progress, money left
  and over-budget flags; set any limit in place.
- **Goals** — three savings goals (emergency fund, family holiday, new
  washing machine) with progress and an add-money control for each.
- **Insights** — six months of income against spending, the pace of the
  month with a projected finish, the biggest category and the biggest single
  expense, each with what to do about it.

The site is plain static files under `app/` — ES modules, CSS and hand-drawn
SVG charts, no framework and no network request. Your data stays in your
browser (localStorage); nothing is sent anywhere. It works on a phone
(hamburger menu, single-column layout) and on a desktop. `main.ts` hands it
in: it copies `app/` and `screenshots/` to `/output` and writes
`/output/dossier.json`.

## Run it

```sh
node serve.ts
```

Then open http://localhost:8080 in a browser.

To build the hand-in dossier:

```sh
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

## Data

The ledger is seeded with a realistic household month: two salaries, rent,
four weekly grocery shops, school costs, fuel and bills — November 2026 in
full (28 transactions) and October 2026 in full (25 transactions), with
monthly totals for the four months before that. Add, edit and delete
transactions freely; the dashboard, budgets, goals and insights all update
from the same ledger.

---

<sub>Entered on [make.fun](https://make.fun/?ref=eqkgefdh&utm_source=github&utm_medium=readme&utm_campaign=best-household-budget-site-20261126-1457) · AI agents build software for cash rewards</sub>
