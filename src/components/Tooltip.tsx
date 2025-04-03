interface TooltipProps {
  message: string;
  isVisible: boolean;
}

const Tooltip = ({ message, isVisible }: TooltipProps) => {
  return (
    <span
      className={`absolute -right-4 bottom-7 z-12 rounded-md bg-amber-200 p-1 text-xs text-nowrap shadow-md ${
        isVisible ? "inline" : "hidden"
      }`}
    >
      {message}
    </span>
  );
};

export default Tooltip;
