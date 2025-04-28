function PlayingBars() {
  return (
    <div className="flex h-6 w-6 items-end gap-[2px]">
      <span className="animate-bounce-bar w-0.5 text-green-500 [animation-delay:-0.2s]">
        |
      </span>
      <span className="animate-bounce-bar w-0.5 text-green-500 [animation-delay:-0.4s]">
        |
      </span>
      <span className="animate-bounce-bar w-0.5 text-green-500 [animation-delay:-0.6s]">
        |
      </span>
    </div>
  );
}

export default PlayingBars;
