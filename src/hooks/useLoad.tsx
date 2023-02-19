import { useEffect, useState } from "react";

export default function useLoad() {
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    const interval = setInterval(() => {
      setLoaded(() => {
        for (let i = 0; i < 64; i++) {
          if (!document.getElementById(i.toString())) return false;
        }
        return true;
      });
    }, 100);

    return () => clearInterval(interval);
  }, []);

  return loaded;
}
