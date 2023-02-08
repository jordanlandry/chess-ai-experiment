import { useEffect } from "react";

export default function useKeybind(key: string, callback: () => void) {
  useEffect(() => {
    const handle = (e: KeyboardEvent) => {
      if (e.key === key) {
        callback();
      }
    };

    document.addEventListener("keydown", handle);
    return () => document.removeEventListener("keydown", handle);
  }, [key, callback]);
}
