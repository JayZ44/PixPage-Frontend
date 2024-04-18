import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import "./Index.jsx";
import { BrowserRouter } from "react-router-dom";

const Root = () => {
  return (
    <BrowserRouter>
      <App />
    </BrowserRouter>
  );
};

ReactDOM.createRoot(document.getElementById("root")).render(<Root />);
