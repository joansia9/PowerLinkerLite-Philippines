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

// Register service worker for PWA benefits
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
}
