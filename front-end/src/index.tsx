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

//bug: autorefresh

// Only register service worker in production to avoid development issues
if (process.env.NODE_ENV === 'production' && 'serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js')
      .then((registration) => {
        console.log('SW registered: ', registration);
      })
      .catch((registrationError) => {
        console.log('SW registration failed: ', registrationError);
      });
  });
} else if (process.env.NODE_ENV === 'development' && 'serviceWorker' in navigator) {
  // Unregister any existing service workers in development
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
    }
  });
}