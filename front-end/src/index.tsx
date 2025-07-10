import React from "react";
import ReactDOM from "react-dom/client";
import "./index.css";
import App from "./App";
import { BrowserRouter as Router } from "react-router-dom";
import './i18n';  // Import i18n configuration

const root = ReactDOM.createRoot(
  document.getElementById("root") as HTMLElement
);
root.render(
  <React.StrictMode>
    {/* added these bc Another React Router v7 future flag warning! You can add this one alongside the previous one. */}
  <Router future={{ v7_relativeSplatPath: true,  v7_startTransition: true  }}> 
      <App />
    </Router>
  </React.StrictMode>
);
