import { useEffect, useRef, useState } from "react";

interface useResponsiveCards1RowProps {
  itemWidth: number;
  containerSelector: string;
}

// ! container selector is the relative container based on which the cards are responsive
export const useResponsiveCards1Row = ({
  itemWidth,
  containerSelector,
}: useResponsiveCards1RowProps) => {
  const containerWidth = useRef(
    document.querySelector(containerSelector)?.clientWidth ?? 0,
  );
  const [numItems, setNumItems] = useState(
    Math.floor(containerWidth.current / itemWidth),
  );

  useEffect(() => {
    const handleResize = () => {
      const container = document.querySelector(containerSelector);
      const width = container?.clientWidth ?? 0;
      setNumItems(Math.floor(width / itemWidth));
    };

    handleResize(); // Initial calculation
    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, [containerSelector, itemWidth]);

  return numItems;
};
