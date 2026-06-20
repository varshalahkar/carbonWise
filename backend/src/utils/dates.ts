export function startOfCurrentMonth(): Date {
  const now = new Date();
  return new Date(now.getFullYear(), now.getMonth(), 1);
}

export function startOfCurrentWeek(): Date {
  const now = new Date();
  const day = now.getDay();
  const start = new Date(now.getFullYear(), now.getMonth(), now.getDate() - day);
  start.setHours(0, 0, 0, 0);
  return start;
}

export function getMonthKey(date: Date): string {
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}`;
}

export function getDayKey(date: Date): string {
  return date.toISOString().slice(0, 10);
}
