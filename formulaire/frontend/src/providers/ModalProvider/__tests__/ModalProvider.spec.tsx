import { ModalProvider, useModal } from "..";
import { ModalType } from "~/core/enums";
import { screen, fireEvent, render } from "@testing-library/react"; // re‑exports RTL

function Tester() {
  const { displayModals, toggleModal } = useModal();

  return (
    <div>
      <span data-testid="flagModalProvider">{String(displayModals[ModalType.FOLDER_RENAME])}</span>
      <button
        onClick={() => {
          toggleModal(ModalType.FOLDER_RENAME);
        }}
      >
        toggleModalProvider
      </button>
    </div>
  );
}

describe("<ModalProvider />", () => {
  it("throws if you call useModal() outside of a ModalProvider", () => {
    // silence React error boundary logs for this test
    const err = jest.spyOn(console, "error").mockImplementation(() => {});

    expect(() => render(<Tester />)).toThrow(/useModal must be used within a ModalProvider/);

    err.mockRestore();
  });

  it("provides the initial state (all false) and toggles correctly", () => {
    render(
      <ModalProvider>
        <Tester />
      </ModalProvider>,
    );

    expect(screen.getByTestId("flagModalProvider").textContent).toBe("false");

    // click to toggle on
    fireEvent.click(screen.getByText("toggleModalProvider"));
    expect(screen.getByTestId("flagModalProvider").textContent).toBe("true");

    // click again to toggle off
    fireEvent.click(screen.getByText("toggleModalProvider"));
    expect(screen.getByTestId("flagModalProvider").textContent).toBe("false");
  });
});
