import "./Modal.css";

export default function Modal({
  children,
  show,
  setShow,
}: {
  children: JSX.Element;
  show: boolean;
  setShow: Function;
}) {
  if (show)
    return (
      <div className="modal-component">
        <div className="backdrop" onClick={() => setShow(false)}></div>
        <section className="modal">{children}</section>
      </div>
    );
  else return null;
}
