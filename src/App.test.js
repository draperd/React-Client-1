import React from "react";
import ReactDOM from "react-dom";
import Collection from "./components/containers/Collection";

it("renders without crashing", () => {
  const div = document.createElement("div");
  ReactDOM.render(<Collection />, div);
});
