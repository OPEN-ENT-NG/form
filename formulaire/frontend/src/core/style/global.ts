export const globalOverrideStyles = {
  body: {
    minWidth: "inherit",
    width: "auto",
    backgroundColor: "var(--edifice-body-bg) !important",
  },

  "main.container-fluid": {
    width: "100%",
    maxWidth: "none",
    minHeight: "calc(100vh - 65px) !important",
    margin: "0",
    padding: "0 ! important",
    alignItems: "center",
    backgroundColor: "transparent !important",
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

  '[data-product="neo"][data-theme="theme-demo-cgi"]': {
    ".header": {
      ".navbar": {
        background: "#200a58",
      },
    },
  },

  ":root": {
    "--toastify-color-light": "var(--theme-palette-common-white)",
    "--toastify-color-dark": "var(--theme-palette-common-black)",
    "--toastify-color-info": "var(--theme-palette-info-main)",
    "--toastify-color-success": "var(--theme-palette-success-main)",
    "--toastify-color-warning": "var(--theme-palette-warning-main)",
    "--toastify-color-error": "var(--theme-palette-error-main)",

    "--toastify-font-family": "helvetica",

    "--toastify-text-color-light": "var(--theme-palette-text-primary)",
    "--toastify-text-color-dark": "var(--theme-palette-common-white)",
  },
};
