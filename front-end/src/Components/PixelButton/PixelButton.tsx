import React, { forwardRef, ButtonHTMLAttributes } from "react";
import { useTranslation } from "react-i18next";
import "./PixelButton.css";

type Variant = "match" | "notMatch" | "neutral";
type Size = "sm" | "md" | "lg";

export interface PixelButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  i18nKey?: string;
  i18nValues?: Record<string, unknown>;
  label?: string;
  variant?: Variant;
  size?: Size;
  block?: boolean;
}

const PixelButton = forwardRef<HTMLButtonElement, PixelButtonProps>(
  (
    {
      i18nKey,
      i18nValues,
      label,
      children,
      variant = "source",
      size = "md",
      block,
      className = "",
      ...rest
    },
    ref
  ) => {
    const { t } = useTranslation();
    const text = i18nKey ? (t(i18nKey, i18nValues) as string) : (label ?? (children as any) ?? "");
    const typeAttr = (rest.type as ButtonHTMLAttributes<HTMLButtonElement>["type"]) ?? "button";

    return (
      <button
        ref={ref}
        type={typeAttr}
        className={[
          "pixel-btn",
          `pixel-btn--${variant}`,
          `pixel-btn--${size}`,
          block ? "pixel-btn--block" : "",
          className,
        ]
          .join(" ")
          .trim()}
        {...rest}
      >
        <span className="pixel-btn__label">{text}</span>
      </button>
    );
  }
);

export default PixelButton;


