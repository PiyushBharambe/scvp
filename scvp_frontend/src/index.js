import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css"; // Global CSS, potentially for Tailwind base
import "./styles/globals.css";
import "./styles/themes.css";
import App from "./App"; // Your main App component
import { ThemeProvider } from "./contexts/ThemeContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <ThemeProvider>
      <App />
    </ThemeProvider>
  </React.StrictMode>
);
