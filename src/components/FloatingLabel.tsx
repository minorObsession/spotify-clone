interface FloatingLabelProps {
  name: string;
  visible: boolean;
}

function FloatingLabel({ name, visible }: FloatingLabelProps) {
  return (
    <span
      className={`absolute left-2 z-10 inline-block -translate-y-1/2 bg-stone-400 text-sm transition-opacity duration-300 ${visible ? "opacity-100" : "opacity-0"}`}
    >
      {name}
    </span>
  );
}

export default FloatingLabel;
