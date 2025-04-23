import { IForm } from "~/core/models/form/types";
import * as Utils from "../utils";
import { ColumnId } from "../enums";
import { makeMockedForm } from "~/tests/utils";
import { renderWithProviders } from "~/tests/testUtils";
import { HomeMainTable } from "..";
import { screen, fireEvent, waitFor } from "@testing-library/react"; // re‑exports RTL
import { DateFormat } from "~/core/enums";
import dayjs from "dayjs";

//------MOCKS------
const mockSetSelected = jest.fn();
const homeContext = {
  selectedForms: [] as IForm[],
  setSelectedForms: mockSetSelected,
};
jest.mock("~/providers/HomeProvider", () => ({
  useHome: () => homeContext,
}));

jest.spyOn(Utils, "useColumns").mockReturnValue([
  { id: ColumnId.SELECT, label: "", width: "5%" },
  { id: ColumnId.TITLE, label: "formulaire.table.title", width: "30%" },
  { id: ColumnId.AUTHOR, label: "formulaire.table.author", width: "20%" },
  { id: ColumnId.RESPONSE, label: "formulaire.table.responses", width: "10%" },
  { id: ColumnId.LAST_MODIFICATION, label: "formulaire.table.modified", width: "30%" },
  { id: ColumnId.STATUS, label: "", width: "10%" },
]);

jest.mock("~/core/constants", () => {
  const actual = jest.requireActual<typeof import("~/core/constants")>("~/core/constants");
  return {
    ...actual,
    DEFAULT_PAGINATION_LIMIT: 4,
  };
});

// ------END OF MOCKS------

describe("<HomeMainTable />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    homeContext.selectedForms = [];
  });

  //Avoid MUI warning about mocked 4 limit being out of range
  beforeAll(() => {
    jest.spyOn(console, "warn").mockImplementation((msg, ...args: unknown[]) => {
      if (typeof msg === "string" && msg.includes("out-of-range value")) {
        // swallow this specific MUI warning
        return;
      }
      console.warn(msg, ...args);
    });
  });

  it("renders column headers from useColumns", () => {
    renderWithProviders(<HomeMainTable forms={[]} />);
    expect(screen.getByText("formulaire.table.title")).toBeInTheDocument();
    expect(screen.getByText("formulaire.table.author")).toBeInTheDocument();
    expect(screen.getByText("formulaire.table.responses")).toBeInTheDocument();
    expect(screen.getByText("formulaire.table.modified")).toBeInTheDocument();
  });

  it("renders rows, formatted date and icons correctly", () => {
    const forms = [makeMockedForm(1), makeMockedForm(2), makeMockedForm(3), makeMockedForm(6)];
    renderWithProviders(<HomeMainTable forms={forms} />);

    // 3 rows
    expect(screen.getAllByTestId("CheckBoxOutlineBlankIcon")).toHaveLength(4);

    // formatted date cell for the first form
    const fmt = dayjs(forms[0].date_creation).format(DateFormat.DAY_MONTH_YEAR_HOUR_MIN);
    expect(screen.getByText(`formulaire.modified${fmt}`)).toBeInTheDocument();

    // icon presence: #2 reminded, #3 collab
    expect(screen.getByTestId("NotificationsIcon")).toBeInTheDocument();
    expect(screen.getByTestId("ShareIcon")).toBeInTheDocument();
    expect(screen.getByTestId("ForwardToInboxIcon")).toBeInTheDocument();
    expect(screen.getByTestId("PublicIcon")).toBeInTheDocument();
  });

  it("clicking a checkbox adds/removes the form via setSelectedForms", async () => {
    const forms = [makeMockedForm(1)];
    const { rerender } = renderWithProviders(<HomeMainTable forms={forms} />);

    const checkbox = screen.getByRole("checkbox", { name: "", hidden: true });
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockSetSelected).toHaveBeenCalledWith([forms[0]]);
    });

    // Simulate un‐checking
    homeContext.selectedForms = [forms[0]];
    rerender(<HomeMainTable forms={forms} />);
    fireEvent.click(checkbox);

    await waitFor(() => {
      expect(mockSetSelected).toHaveBeenCalledWith([]);
    });
  });

  it("does not render pagination if forms.length ≤ limit", () => {
    const forms = [makeMockedForm(1), makeMockedForm(2)];
    renderWithProviders(<HomeMainTable forms={forms} />);
    expect(screen.queryByLabelText("formulaire.table.rows.per.page")).toBeNull();
  });

  it("renders pagination when forms.length > limit and responds to page change", () => {
    const forms = [makeMockedForm(1), makeMockedForm(2), makeMockedForm(3), makeMockedForm(4), makeMockedForm(5)];
    renderWithProviders(<HomeMainTable forms={forms} />);

    // pagination controls
    const nextBtn = screen.getByTitle("Go to next page");
    const prevBtn = screen.getByTitle("Go to previous page");
    expect(nextBtn).toBeInTheDocument();
    expect(prevBtn).toBeInTheDocument();

    fireEvent.click(nextBtn);
    // on page 1, the only row should be Form #5
    expect(screen.getByText("Form #5")).toBeInTheDocument();
  });

  it("changing rows-per-page resets to page 0 and uses the new limit", async () => {
    const forms = [makeMockedForm(1), makeMockedForm(2), makeMockedForm(3), makeMockedForm(4), makeMockedForm(5)];
    renderWithProviders(<HomeMainTable forms={forms} />);

    // Expect to see form 4 but not form 5
    expect(screen.getByText("Form #4")).toBeInTheDocument();
    expect(screen.queryByText("Form #5")).toBeNull();

    const rowsPerPageTrigger = screen.getByRole("combobox");
    fireEvent.mouseDown(rowsPerPageTrigger);

    // 5) click the “10” option
    const opt10 = await screen.findByRole("option", { name: "10" });
    fireEvent.click(opt10);

    expect(screen.queryByText("Form #5")).toBeInTheDocument();
  });
});
