const DIVISORS = [
  { limit: 60, divisor: 1, unit: "second" },
  { limit: 3600, divisor: 60, unit: "minute" },
  { limit: 86400, divisor: 3600, unit: "hour" },
  { limit: 604800, divisor: 86400, unit: "day" },
  { limit: 2629800, divisor: 604800, unit: "week" },
  { limit: 31557600, divisor: 2629800, unit: "month" },
  { limit: Infinity, divisor: 31557600, unit: "year" },
];

const rtf = new Intl.RelativeTimeFormat(undefined, {
  numeric: "auto",
});

export const formatRelativeTime = (value) => {
  if (!value) return "just now";
  const timestamp = value instanceof Date ? value.getTime() : Date.parse(value);

  if (Number.isNaN(timestamp)) {
    return "just now";
  }

  const now = Date.now();
  let deltaSeconds = Math.round((timestamp - now) / 1000);

  const absSeconds = Math.abs(deltaSeconds);
  if (absSeconds < 45) {
    return "just now";
  }

  for (const { limit, divisor, unit } of DIVISORS) {
    if (absSeconds < limit) {
      const value = Math.round(deltaSeconds / divisor);
      return rtf.format(value, unit);
    }
  }

  return "just now";
};
