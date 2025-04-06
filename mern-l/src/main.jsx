import { createRoot } from "react-dom/client";
import App from "./App";
import { BrowserRouter as Router, Routes, Route, BrowserRouter } from "react-router-dom";
const root = createRoot(document.getElementById("root"));

root.render(
  <BrowserRouter>
  <App/>
  </BrowserRouter>
)