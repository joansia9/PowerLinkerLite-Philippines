import * as React from "react";
import { Outlet } from "react-router-dom";
import "./Layout.css";

export interface IAppProps {}

//implements all features that remain from page to page
// such as the header, navbar, and footer
export function Layout(props: IAppProps) {
  
  return (
    <>

      {/* Header */}
      <header className="site-header">
        <h1>Power Linker</h1>
        <img
          className="logo"
          src="/RLL_Logo_Full.png"
          alt="Record Linking Lab Logo"
        />
      </header>

      {/* Body (injected components) */}
      <Outlet />

      {/* Footer */}
      <p id="copyright">
          {" "}Copyright &copy; BYU Record Linking Lab 2023. All rights reserved.{" "}
      </p>
    </>
  );
}
