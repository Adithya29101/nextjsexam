export type DateFilterValue = "all" | "today" | "week" | "month";

export function getDateRange(filter: DateFilterValue): {
  startDate?: string;
  endDate?: string;
} {
  if (filter === "all") return {};

  const now = new Date();
  const start = new Date(now);
  start.setHours(0, 0, 0, 0);

  const end = new Date(start);
  end.setHours(23, 59, 59, 999);

  if (filter === "week") {
    // Monday as the first day of the week.
    const daysSinceMonday = (start.getDay() + 6) % 7;
    start.setDate(start.getDate() - daysSinceMonday);
    end.setDate(start.getDate() + 6);
    end.setHours(23, 59, 59, 999);
  }

  if (filter === "month") {
    start.setDate(1);
    end.setMonth(start.getMonth() + 1, 0);
    end.setFullYear(start.getFullYear());
    end.setHours(23, 59, 59, 999);
  }

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}
