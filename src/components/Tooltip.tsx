interface TooltipProps {
  message: string;
  isVisible: boolean;
  directionOfMenu?: "topLeft" | "bottomLeft";
  addClassName?: string;
}

const Tooltip = ({
  message,
  isVisible,
  directionOfMenu,
  addClassName,
}: TooltipProps) => {
  return (
    <span
      // ! needs a relative on parent
      className={`absolute ${directionOfMenu === "bottomLeft" ? "-left-40" : "-right-4"} ${directionOfMenu === "bottomLeft" ? "top-7" : "bottom-7"} z-1000 rounded-md bg-amber-200 p-1 text-xs text-nowrap shadow-md ${
        isVisible ? "inline" : "hidden"
      } ${addClassName} `}
    >
      {message}
    </span>
  );
};

export default Tooltip;
