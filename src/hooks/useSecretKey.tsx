import { useEffect, useState } from "react";

export default function useSecretCode(code: string, timeLimitPerKey = 1000) {
  const [secretKey, setSecretKey] = useState(false);

  const [index, setIndex] = useState(0);

  useEffect(() => {
    const timeout = setTimeout(() => {
      setIndex(0);
    }, timeLimitPerKey);

    if (index === code.length) {
      setSecretKey((prev) => !prev);
      setIndex(0);
      clearTimeout(timeout);
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === code[index]) {
        setIndex((prev) => prev + 1);
        clearTimeout(timeout);
      } else setIndex(0);
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
      clearInterval(timeout);
    };
  }, [index]);

  return secretKey;
}
