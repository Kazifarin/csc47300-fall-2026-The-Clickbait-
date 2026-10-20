import { describe, it, expect } from "vitest";
import { resources } from "../data/resources";
import { filterResources } from "./search";
import type { Filters } from "../types";
const base: Filters = {
  query: "",
  category: "All Resources",
  savedOnly: false,
  openOnly: false,
};
describe("resource search and combined filters", () => {
  it("matches names independent of case and whitespace", () => {
    expect(
      filterResources(
        resources,
        { ...base, query: "  WRITING    center " },
        [],
      ).map((r) => r.id),
    ).toEqual(["writing"]);
  });
  it("matches categories and building names", () => {
    expect(
      filterResources(resources, { ...base, query: "wellness" }, []).map(
        (r) => r.id,
      ),
    ).toEqual(["counseling"]);
    expect(
      filterResources(resources, { ...base, query: "marshak" }, []),
    ).toHaveLength(2);
  });
  it("combines name, category, saved, and open filters", () => {
    expect(
      filterResources(
        resources,
        {
          ...base,
          query: "writing",
          category: "Writing",
          savedOnly: true,
          openOnly: true,
        },
        ["writing"],
        new Date("2026-10-19T16:00:00Z"),
      ).map((r) => r.id),
    ).toEqual(["writing"]);
  });
  it("excludes unknown hours from open-now results", () => {
    expect(
      filterResources(
        resources,
        { ...base, openOnly: true },
        [],
        new Date("2026-10-19T16:00:00Z"),
      ).some((r) => r.id === "pantry"),
    ).toBe(false);
  });
  it("returns an empty list without dropping constraints", () => {
    expect(
      filterResources(
        resources,
        { ...base, query: "writing", category: "Careers" },
        [],
      ),
    ).toEqual([]);
  });
  it("returns only saved resources", () => {
    expect(
      filterResources(resources, { ...base, savedOnly: true }, ["pantry"]).map(
        (r) => r.id,
      ),
    ).toEqual(["pantry"]);
  });
});
