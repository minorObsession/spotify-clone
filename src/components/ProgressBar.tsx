interface ProgressBarProps extends React.HTMLProps<HTMLDivElement> {
  max: number;
  currValue: number;
  bgColor?: string; // accept Tailwind class or hex color
  barColor?: string; // accept Tailwind class or hex color
  additionalClasses?: string;
  onValueChange?: (value: number) => void; // Optional callback for when the value changes
}

function ProgressBar({
  max,
  currValue,
  onValueChange,
  bgColor = "bg-gray-200", // Default background color
  barColor = "bg-blue-500", // Default progress bar color
  additionalClasses,
}: ProgressBarProps) {
  // Check if the color is a hex value or Tailwind class
  const bgStyle = bgColor.startsWith("#") ? { backgroundColor: bgColor } : {};
  const barStyle = barColor.startsWith("#")
    ? { backgroundColor: barColor }
    : {};

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const clickX = e.clientX - rect.left;
    const newPercentage = clickX / rect.width;
    const newValue = Math.round(newPercentage * max * 100);

    if (onValueChange) onValueChange(newValue / 100);
  };

  return (
    <div
      onClick={handleClick}
      className={`relative h-2 w-full overflow-hidden rounded-lg ${!bgColor.startsWith("#") ? bgColor : ""} ${additionalClasses}`}
      style={bgStyle}
    >
      <div
        className={`h-full ease-in-out ${!barColor.startsWith("#") ? barColor : ""}`}
        style={{
          width: `${(currValue / max) * 100}%`, // Calculate progress width
          ...barStyle,
        }}
      />
    </div>
  );
}

export default ProgressBar;
