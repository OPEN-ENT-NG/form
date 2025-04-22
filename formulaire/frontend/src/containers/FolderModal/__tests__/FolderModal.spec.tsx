import "@testing-library/jest-dom";
import { screen, fireEvent, waitFor } from "@testing-library/react"; // re‑exports RTL
import { renderWithProviders } from "~/tests/testUtils";
import { FolderModal } from "~/containers/FolderModal";
import { FolderModalMode } from "~/containers/FolderModal/types";

// 1) Mock HomeProvider hook
jest.mock("~/providers/HomeProvider", () => ({
  useHome: () => ({
    currentFolder: { id: "parent-123" },
    selectedFolders: [{ id: "sel-456", parent_id: "parent-123" }],
  }),
}));

jest.mock("react-i18next", () => ({
  useTranslation: () => ({
    t: (key: string) => key,
  }),
}));

const mockCreate = jest.fn().mockResolvedValue({});
const mockUpdate = jest.fn().mockResolvedValue({});

jest.mock("~/services/api/services/formulaireApi/folderApi", () => ({
  useCreateFolderMutation: () => [mockCreate],
  useUpdateFolderMutation: () => [mockUpdate],
}));

describe("<FolderModal />", () => {
  const handleClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("renders and closes when cancel is clicked", () => {
    renderWithProviders(<FolderModal isOpen={true} handleClose={handleClose} mode={FolderModalMode.CREATE} />);

    // Cancel button text equals key
    const cancelBtn = screen.getByRole("button", { name: "formulaire.cancel" });
    fireEvent.click(cancelBtn);
    expect(handleClose).toHaveBeenCalledTimes(1);
  });

  it("in CREATE mode, inputs name and calls createFolder", async () => {
    renderWithProviders(<FolderModal isOpen={true} handleClose={handleClose} mode={FolderModalMode.CREATE} />);

    // Should display the create title and button
    expect(screen.getByText("formulaire.folder.create")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    const createBtn = screen.getByRole("button", { name: "formulaire.create" });

    // Type and click
    fireEvent.change(input, { target: { value: "New Folder" } });
    fireEvent.click(createBtn);

    await waitFor(() => {
      expect(mockCreate).toHaveBeenCalledWith({
        parent_id: "parent-123",
        name: "New Folder",
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("in RENAME mode, inputs name and calls updateFolder", async () => {
    renderWithProviders(<FolderModal isOpen={true} handleClose={handleClose} mode={FolderModalMode.RENAME} />);

    expect(screen.getByText("formulaire.folder.rename")).toBeInTheDocument();
    const input = screen.getByRole("textbox");
    const renameBtn = screen.getByRole("button", { name: "formulaire.rename" });

    fireEvent.change(input, { target: { value: "Renamed Folder" } });
    fireEvent.click(renameBtn);

    await waitFor(() => {
      expect(mockUpdate).toHaveBeenCalledWith({
        id: "sel-456",
        parent_id: "parent-123",
        name: "Renamed Folder",
      });
      expect(handleClose).toHaveBeenCalled();
    });
  });

  it("in RENAME mode with no selection, does nothing on click", () => {
    // Override useHome to return empty selection
    jest.doMock("~/providers/HomeProvider", () => ({
      useHome: () => ({
        currentFolder: { id: "parent-123" },
        selectedFolders: [],
      }),
    }));
    // Use the already imported FolderModal after mocking

    renderWithProviders(<FolderModal isOpen={true} handleClose={handleClose} mode={FolderModalMode.RENAME} />);

    fireEvent.change(screen.getByRole("textbox"), {
      target: { value: "Whatever" },
    });
    fireEvent.click(screen.getByRole("button", { name: "formulaire.rename" }));

    expect(mockUpdate).not.toHaveBeenCalled();
    // handleClose is only called if update runs
    expect(handleClose).not.toHaveBeenCalled();
  });
});
