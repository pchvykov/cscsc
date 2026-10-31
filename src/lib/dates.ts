// Dates as YYYY-MM-DD strings, compared as text (what DateSwitch does in the browser).
export const iso = (d: Date) => d.toISOString().slice(0, 10);
export const buildDay = iso(new Date());
// Two days back, so items still "today" in a visitor's time zone are rendered.
export const slackDay = iso(new Date(Date.now() - 2 * 864e5));
