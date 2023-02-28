import { useState } from "react";
import useCreateEndings from "../../hooks/db/useCreateEndings";

export default function GenerateEndings() {
  const [isRunning, setIsRunning] = useState(false);

  useCreateEndings(isRunning);

  return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
      <button style={{ fontSize: "2rem" }} onClick={() => setIsRunning(true)}>
        Generate Endings
      </button>
    </div>
  );
}
