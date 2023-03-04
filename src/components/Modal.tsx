import { createPortal } from "react-dom";
import useKeybind from "../hooks/useKeybind";

type Props = {
  children: React.ReactNode;
  open: boolean;
  onClose: any;
  className?: string;
  customStyles?: React.CSSProperties;
};

export default function Modal({ children, open, onClose, className, customStyles }: Props) {
  useKeybind("Escape", () => (open ? onClose() : null));

  const MODAL_STYLES: React.CSSProperties = {
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    borderRadius: "8px",
    backgroundColor: "#222",
    color: "white",
    zIndex: 1000,
    ...customStyles,
  };

  const OVERLAY_STYLES: React.CSSProperties = {
    position: "fixed",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: "rgba(0, 0, 0, .7)",
    zIndex: 1000,
  };

  const X_STYLES: React.CSSProperties = {
    position: "absolute",
    cursor: "pointer",
    color: "white",
    backgroundColor: "rgba(0, 0, 0, 0.2)",
    fontSize: "1.25rem",
    borderRadius: "50%",
    width: "24px",
    height: "24px",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    padding: "0.25rem",
    top: "0.5rem",
    right: "0.5rem",
  };

  if (!open) return null;
  return createPortal(
    <>
      <div style={OVERLAY_STYLES} onClick={onClose}></div>
      <div className="modal" style={MODAL_STYLES}>
        {children}
        <div style={X_STYLES} color="white" onClick={onClose}>
          X
        </div>
      </div>
    </>,
    document.getElementById("portal")!
  );
}
