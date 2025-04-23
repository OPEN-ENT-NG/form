import { screen, fireEvent, waitFor } from "@testing-library/react"; // re‑exports RTL
import { renderWithProviders } from "~/tests/testUtils";
import { FormPropModal } from "~/containers/FormPropModal";
import { FormPropModalMode } from "../enums";
import { makeMockedForm } from "~/tests/utils";

//------MOCKS------

const homeContext = {
  currentFolder: { id: "parent-123" },
  selectedForms: [makeMockedForm(1)],
};
jest.mock("~/providers/HomeProvider", () => ({
  useHome: () => homeContext,
}));

const handleClose = jest.fn();

//------END OF MOCKS------

//------HELPERS------

describe("<FormPropModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders and closes when cancel is clicked", async () => {
    renderWithProviders(
      <FormPropModal isOpen={true} handleClose={handleClose} mode={FormPropModalMode.CREATE} isRgpdPossible={false} />,
    );

    await waitFor(() => {});

    const cancelBtn = screen.getByRole("button", { name: "formulaire.cancel" });
    fireEvent.click(cancelBtn);
    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });
});
