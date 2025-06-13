import { ComponentProps, useEffect, useState } from "react";
import "./Loading.css";

const LOADING_DELAY = 250;

export function Loading({
  message,
  className,
  ...props
}: {
  message?: string;
} & ComponentProps<"div">) {
  const [visible, setVisible] = useState<boolean>(false);
  useEffect(() => {
    const timeout = setTimeout(() => setVisible(true), LOADING_DELAY);
    return () => clearTimeout(timeout);
  }, []);

  return visible ? (
    <div
      className={
        "loader" +
        (visible ? " visible" : "") +
        (className ? " " + className : "")
      }
      {...props}
    >
      <div className="loading-ring">
        <div></div>
        <div></div>
        <div></div>
        <div></div>
      </div>
      <div className="loading-text">{message}</div>
    </div>
  ) : null;
}
