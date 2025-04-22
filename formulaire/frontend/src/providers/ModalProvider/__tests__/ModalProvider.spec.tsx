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
    // wrap render in a try/catch so RTL doesn't swallow the error
    let caught: Error | null = null;
    try {
      render(<Tester />);
    } catch (e) {
      caught = e ? (e as Error) : null;
    }
    expect(caught).toBeInstanceOf(Error);
    expect(caught?.message).toMatch(/useModal must be used within a ModalProvider/);
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
