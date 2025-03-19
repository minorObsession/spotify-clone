interface ProgressBarProps {
  max: number;
  currValue: number;
  bgColor?: string; // Accepts Tailwind class or hex color
  barColor?: string; // Accepts Tailwind class or hex color
  additionalClasses?: string;
}

function ProgressBar({
  max,
  currValue,
  bgColor = "bg-gray-200", // Default background color
  barColor = "bg-blue-500", // Default progress bar color
  additionalClasses,
}: ProgressBarProps) {
  // Check if the color is a hex value or Tailwind class
  const bgStyle = bgColor.startsWith("#") ? { backgroundColor: bgColor } : {};
  const barStyle = barColor.startsWith("#")
    ? { backgroundColor: barColor }
    : {};

  return (
    <div
      className={`relative h-2 w-full overflow-hidden rounded-lg ${!bgColor.startsWith("#") ? bgColor : ""} ${additionalClasses}`}
      style={bgStyle}
    >
      <div
        className={`h-full transition-all duration-300 ease-in-out ${!barColor.startsWith("#") ? barColor : ""}`}
        style={{
          width: `${(currValue / max) * 100}%`, // Calculate progress width
          ...barStyle,
        }}
      />
    </div>
  );
}

export default ProgressBar;
