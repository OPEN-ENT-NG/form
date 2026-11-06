import { describe, expect, it } from "vitest";

import { computeEndingDate } from "./utils";

describe("computeEndingDate", () => {
  const openingDate = new Date(2026, 9, 1, 0, 0, 0, 0); // 01/10/2026 local

  it("keeps the real ending date of a closed form (ending date in the past)", () => {
    const pastEndingDate = new Date(2026, 9, 20, 23, 59, 59, 999).toISOString();

    expect(computeEndingDate(openingDate, pastEndingDate)).toEqual(new Date(pastEndingDate));
  });

  it("keeps a future ending date", () => {
    const futureEndingDate = new Date(2099, 0, 1, 23, 59, 59, 999).toISOString();

    expect(computeEndingDate(openingDate, futureEndingDate)).toEqual(new Date(futureEndingDate));
  });

  it("returns the day after opening when ending date is not after opening date", () => {
    const endingBeforeOpening = new Date(2026, 8, 15).toISOString();

    expect(computeEndingDate(openingDate, endingBeforeOpening)).toEqual(new Date(2026, 9, 2, 0, 0, 0, 0));
    expect(computeEndingDate(openingDate, openingDate.toISOString())).toEqual(new Date(2026, 9, 2, 0, 0, 0, 0));
  });

  it("returns one year after opening when there is no saved ending date", () => {
    expect(computeEndingDate(openingDate, null)).toEqual(new Date(2027, 9, 1, 0, 0, 0, 0));
    expect(computeEndingDate(openingDate)).toEqual(new Date(2027, 9, 1, 0, 0, 0, 0));
  });

  it("does not depend on the current date", () => {
    const pastEndingDate = new Date(2020, 0, 10).toISOString();
    const pastOpeningDate = new Date(2020, 0, 1);

    expect(computeEndingDate(pastOpeningDate, pastEndingDate)).toEqual(new Date(pastEndingDate));
  });
});
