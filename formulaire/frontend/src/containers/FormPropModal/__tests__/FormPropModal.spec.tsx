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

const mockCreateForm = jest.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
const mockUpdateForm = jest.fn().mockReturnValue({ unwrap: () => Promise.resolve() });
jest.mock("~/services/api/services/formulaireApi/formApi", () => ({
  useCreateFormMutation: () => [mockCreateForm],
  useUpdateFormMutation: () => [mockUpdateForm],
}));

jest.mock("~/services/api/services/formulaireApi/delegateApi", () => ({
  useGetDelegatesQuery: () => ({
    data: [],
    isLoading: false,
    isError: false,
    refetch: jest.fn(),
  }),
}));

//------END OF MOCKS------

//------HELPERS------

describe("<FormPropModal />", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    // reset selectedForms:
    homeContext.selectedForms = [makeMockedForm(1)];
  });

  it("renders and closes when cancel is clicked", async () => {
    renderWithProviders(
      <FormPropModal isOpen handleClose={handleClose} mode={FormPropModalMode.CREATE} isRgpdPossible={false} />,
    );

    fireEvent.click(screen.getByRole("button", { name: "formulaire.cancel" }));

    await waitFor(() => {
      expect(handleClose).toHaveBeenCalledTimes(1);
    });
  });

  describe("submitting", () => {
    it("in CREATE mode, typing a title and clicking Save calls createForm + handleClose", async () => {
      renderWithProviders(
        <FormPropModal isOpen handleClose={handleClose} mode={FormPropModalMode.CREATE} isRgpdPossible={false} />,
      );

      // 1) type a title so Save becomes enabled
      const titleInput = screen.getByPlaceholderText("formulaire.form.create.placeholder");
      fireEvent.change(titleInput, { target: { value: "My New Form" } });

      // 2) click Save
      const saveBtn = screen.getByRole("button", { name: "formulaire.save" });
      expect(saveBtn).not.toBeDisabled();
      fireEvent.click(saveBtn);

      // 3) await the mockCreateForm unwrap + expect handleClose
      await waitFor(() => {
        expect(mockCreateForm).toHaveBeenCalledTimes(1);
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
    });

    it("in UPDATE mode, typing a title and clicking Save calls updateForm + handleClose", async () => {
      // also stub a selected form with an existing title so the input is pre‐filled
      const existing = makeMockedForm(99);
      existing.title = "Old Title";
      homeContext.selectedForms = [existing];

      renderWithProviders(
        <FormPropModal isOpen handleClose={handleClose} mode={FormPropModalMode.UPDATE} isRgpdPossible={false} />,
      );

      // 1) change the title
      const titleInput = screen.getByDisplayValue("Old Title");
      fireEvent.change(titleInput, { target: { value: "Updated Title" } });

      // 2) click Save
      const saveBtn = screen.getByRole("button", { name: "formulaire.save" });
      fireEvent.click(saveBtn);

      // 3) expect updateForm + close
      await waitFor(() => {
        expect(mockUpdateForm).toHaveBeenCalledTimes(1);
        expect(handleClose).toHaveBeenCalledTimes(1);
      });
    });
  });

  describe("toggling description", () => {
    it("initially hides the description textarea, and toggles it when clicking the Description checkbox", async () => {
      renderWithProviders(
        <FormPropModal isOpen handleClose={jest.fn()} mode={FormPropModalMode.CREATE} isRgpdPossible={false} />,
      );

      // The checkbox label is the i18n key for DESCRIPTION
      await screen.findByRole("button", { name: "formulaire.save" });
      const checkboxLabel = screen.getByText("formulaire.prop.description.label");
      expect(screen.queryByPlaceholderText("formulaire.prop.description.placeholder")).toBeNull();

      // 1st click: opens the textarea
      fireEvent.click(checkboxLabel);
      expect(screen.getByPlaceholderText("formulaire.prop.description.placeholder")).toBeInTheDocument();

      // 2nd click: hides it again
      fireEvent.click(checkboxLabel);
      expect(screen.queryByPlaceholderText("formulaire.prop.description.placeholder")).toBeNull();
    });
  });
});
