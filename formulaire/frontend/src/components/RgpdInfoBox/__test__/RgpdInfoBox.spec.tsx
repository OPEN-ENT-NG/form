// RGPDInfoBox.test.tsx
import { renderWithProviders } from "~/tests/testUtils";
import { screen } from "@testing-library/react";
import dayjs from "dayjs";

import RGPDInfoBox from "~/components/RgpdInfoBox";
import { DateFormat } from "~/core/enums";
import { IRGPDI18nParams } from "../types";

// --- mock i18n ---
jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const map: Record<string, string> = {
        "formulaire.prop.rgpd.description.intro": "Intro: {{0}} - {{1}}",
        "formulaire.prop.rgpd.description.delegates": "Del: {{0}}, {{1}}, {{2}}, {{3}}, {{4}}",
      };
      return map[key] ?? key;
    },
  }),
}));

describe("<RGPDInfoBox />", () => {
  const baseParams: IRGPDI18nParams = {
    finalite: "Test Purpose",
    expirationDate: dayjs("2025-12-31"),
    rectoratName: "Rector Name",
    rectoratEmail: "rector@example.com",
    rectoratAddress: "123 Rue de Test",
    rectoratPostalCode: "75001",
    rectoratCity: "Paris",
    villeName: "City Hall",
    villeEmail: "city@example.com",
  };

  it("renders the intro with formatted date", () => {
    renderWithProviders(<RGPDInfoBox params={baseParams} />);

    const formatted = dayjs(baseParams.expirationDate).format(DateFormat.DAY_MONTH_YEAR);
    expect(screen.getByText(`Intro: ${baseParams.finalite} - ${formatted}`)).toBeInTheDocument();
  });

  it("renders two list items for rectorat and ville with correct interpolation", () => {
    renderWithProviders(<RGPDInfoBox params={baseParams} />);

    const items = screen.getAllByRole("listitem");
    expect(items).toHaveLength(2);

    // First item: rectorat
    expect(items[0]).toHaveTextContent(
      `Del: ${baseParams.rectoratName}, ${baseParams.rectoratEmail}, ${baseParams.rectoratAddress}, ${baseParams.rectoratPostalCode}, ${baseParams.rectoratCity}`,
    );

    // Second item: ville (with empty placeholders)
    expect(items[1]).toHaveTextContent(`Del: ${baseParams.villeName}, ${baseParams.villeEmail}, , ,`);
  });
});
