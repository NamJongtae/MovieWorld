import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import ScrollToTop from "./compoents/commons/scrollToTop/ScrollToTop";
import { BrowserRouter } from "react-router-dom";
import GlobalStyles from "./GlobalStyles";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <BrowserRouter>
    <GlobalStyles />
    <ScrollToTop />
    <App />
  </BrowserRouter>
);
