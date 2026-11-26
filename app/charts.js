// Hand-drawn SVG charts for Home Ledger. One job: turn numbers into SVG
// strings — a spending donut and a monthly income-vs-spending bar pair.
// No library, no canvas, no network.

import { money0 } from './format.js';

// Donut of spending by category. `items` are {label, color, spent}.
// Returns an SVG string plus a legend-ready total.
export function donut(items, size = 190, monthLabel = '') {
  const total = items.reduce((s, i) => s + i.spent, 0);
  const r = size / 2 - 14;
  const cx = size / 2;
  const cy = size / 2;
  if (total <= 0) {
    return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="No spending yet this month"><circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="#eef1ec" stroke-width="26"/><text x="${cx}" y="${cy}" text-anchor="middle" font-size="15" fill="#5c6a61">No spending yet</text></svg>`;
  }
  let offset = 0;
  const arcs = items
    .filter((i) => i.spent > 0)
    .map((i) => {
      const frac = i.spent / total;
      const dash = frac * 2 * Math.PI * r;
      const gap = 2 * Math.PI * r - dash;
      const el = `<circle cx="${cx}" cy="${cy}" r="${r}" fill="none" stroke="${i.color}" stroke-width="26" stroke-dasharray="${dash.toFixed(2)} ${gap.toFixed(2)}" stroke-dashoffset="${(-offset).toFixed(2)}" transform="rotate(-90 ${cx} ${cy})"/>`;
      offset += dash;
      return el;
    })
    .join('');
  return `<svg viewBox="0 0 ${size} ${size}" width="${size}" height="${size}" role="img" aria-label="Spending by category, ${money0(total)} in total">${arcs}<text x="${cx}" y="${cy - 4}" text-anchor="middle" font-size="20" font-weight="800" fill="#1f2a24">${money0(total)}</text><text x="${cx}" y="${cy + 16}" text-anchor="middle" font-size="12" fill="#5c6a61">spent in ${monthLabel}</text></svg>`;
}

// Paired bars: income (green) vs spending (amber) per month.
// `months` are {label, income, spent}. Heights are relative to the max value.
export function monthBars(months, height = 130) {
  const max = Math.max(...months.map((m) => Math.max(m.income, m.spent)), 1);
  const cols = months
    .map((m) => {
      const inH = Math.max(3, Math.round((m.income / max) * height));
      const outH = Math.max(3, Math.round((m.spent / max) * height));
      return `<div class="bar-col">
        <div class="pair"><i class="in" style="height:${inH}px" title="Income ${money0(m.income)}"></i><i class="out" style="height:${outH}px" title="Spent ${money0(m.spent)}"></i></div>
        <span class="val">${money0(m.spent)}</span>
        <span class="lbl">${m.label}</span>
      </div>`;
    })
    .join('');
  return `<div class="bars" role="img" aria-label="Income versus spending, June to November">${cols}</div>`;
}
