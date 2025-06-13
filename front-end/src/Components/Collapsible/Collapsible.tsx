import "./Collapsible.css";

export default function Collapsible({
  open,
  children,
}: {
  open: boolean;
  children: JSX.Element;
}) {
  return (
    <div className={"collapsible-outer" + (open ? " open" : "")}>
      <div className="collapsible-inner">{children}</div>
    </div>
  );
}
