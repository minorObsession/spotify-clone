import { useEffect, useState } from "react";

export function useScreenWidthRem() {
  const [screenWidth, setScreenWidth] = useState<number>(
    Math.ceil(window.innerWidth / 10),
  );

  useEffect(() => {
    const handleResize = () =>
      setScreenWidth(Math.ceil(window.innerWidth / 10));

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [setScreenWidth]);

  return {
    screenWidth,
    isLargeScreen: screenWidth > 48,
  };
}
