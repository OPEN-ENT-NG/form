jest.mock("@cgi-learning-hub/ui", () => {
  const React = require("react");

  // Mock tous les composants que vous utilisez réellement
  return {
    Button: (props) => React.createElement("button", props, props.children),
    TextField: (props) => React.createElement("input", props),
    Typography: (props) => React.createElement("div", props, props.children),
    Dialog: (props) => React.createElement("div", props, props.children),
    DialogTitle: (props) => React.createElement("div", props, props.children),
    DialogContent: (props) => React.createElement("div", props, props.children),
    DialogActions: (props) => React.createElement("div", props, props.children),
  };
});
