export const globalOverrideStyles = {
  "main.container-fluid": {
    padding: "0 ! important",
    minHeight: "calc(100vh - 71px) ! important",
    height: "calc(100vh - 71px) ! important",
  },

  "#media-library": {
    maxHeight: "fit-content",
    position: "fixed",
    top: 0,
    left: 0,
    width: "100vw",
    height: "100vh",
    zIndex: 9999,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  ".selected-icon": {
    width: "3.2rem !important",
    height: "3.2rem !important",
    zIndex: 1,
  },
  '[data-type="dnd-preview"] [role="button"]': {
    cursor: `inherit !important`,
  },
};
