import { useEffect } from "react";

export function useKeyPress(
  keyPressed: string,
  functionToRun: (e: KeyboardEvent) => void
) {
  useEffect(() => {
    function callback(e: KeyboardEvent) {
      if (e.code.toLowerCase() === keyPressed.toLowerCase()) {
        e.preventDefault();
        functionToRun(e);
      }
    }

    document.addEventListener("keydown", callback);

    return () => {
      document.removeEventListener("keydown", callback);
    };
  }, [functionToRun, keyPressed]);
}
