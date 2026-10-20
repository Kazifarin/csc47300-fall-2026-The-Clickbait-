import type { Filters, Resource } from "../types";
import { getStatus } from "./hours";
export const normalize = (text: string) =>
  text.toLowerCase().trim().replace(/\s+/g, " ");
export function filterResources(
  resources: Resource[],
  filters: Filters,
  saved: string[],
  now = new Date(),
) {
  const words = normalize(filters.query).split(" ").filter(Boolean);
  return resources.filter(
    (r) =>
      words.every((word) =>
        normalize(
          `${r.name} ${r.category} ${r.building} ${r.description} ${r.services.join(" ")}`,
        ).includes(word),
      ) &&
      (filters.category === "All Resources" ||
        r.category === filters.category) &&
      (!filters.savedOnly || saved.includes(r.id)) &&
      (!filters.openOnly ||
        ["open", "closing"].includes(getStatus(r.hours, now).state)),
  );
}
