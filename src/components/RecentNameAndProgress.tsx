import ProgressBar from "./ProgressBar";

function RecentNameAndProgress() {
  // ! measure chars - when show name too long display 3 dots and only display whole name on hover
  return (
    <div className="col-2 row-span-2 flex flex-col gap-1.5 p-1">
      <h5 className="text-xs">
        {/* what if this is a safjasfklasfklajsfkaaskhfaslkjfsjfjkash */}
        what if this is a long one
      </h5>
      <ProgressBar max={10} currValue={8} />
    </div>
  );
}

export default RecentNameAndProgress;
