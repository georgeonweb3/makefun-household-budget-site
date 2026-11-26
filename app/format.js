// Money and date formatting for Home Ledger. One job: turn numbers and
// ISO dates into the strings the pages show. All amounts are dollars.

export const money = (n) =>
  '$' + Number(n).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 });

export const money0 = (n) =>
  '$' + Math.round(Number(n)).toLocaleString('en-US');

export const moneySigned = (n) => (n < 0 ? '−' + money(-n) : money(n));

export const pct = (n) => Math.round(n * 100) + '%';

// "2026-11-24" -> "24 Nov 2026"
export function fmtDate(iso) {
  const [y, m, d] = iso.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${d} ${months[m - 1]} ${y}`;
}

// "2026-11" -> "November 2026"
export function fmtMonth(key) {
  const [y, m] = key.split('-').map(Number);
  const months = ['January', 'February', 'March', 'April', 'May', 'June', 'July', 'August', 'September', 'October', 'November', 'December'];
  return `${months[m - 1]} ${y}`;
}

// "2026-11" -> "Nov 2026" (short enough for the donut's centre label)
export function fmtMonthShort(key) {
  const [y, m] = key.split('-').map(Number);
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  return `${months[m - 1]} ${y}`;
}

export const escape = (s) =>
  String(s).replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);
