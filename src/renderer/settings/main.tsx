import App from "./App";
import React from "react";
import ReactDOM from "react-dom";

const render = () => {
  const container = document.getElementById("app");
  ReactDOM.render(<App />, container);
};

render();
