import { isEnterPressed } from "~/core/utils";
import { KeyName } from "~/core/enums";
import { KeyboardEvent } from "react";

describe("isEnterPressed", () => {
  it("returns true when event.key === ENTER", () => {
    const mockEvent = { key: KeyName.ENTER } as KeyboardEvent;
    expect(isEnterPressed(mockEvent)).toBe(true);
  });

  it("returns false for other keys", () => {
    const mockEvent = { key: "Escape" } as KeyboardEvent;
    expect(isEnterPressed(mockEvent)).toBe(false);
  });
});
