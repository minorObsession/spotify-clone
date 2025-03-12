import ProgressBar from "./ProgressBar";

function RecentNameAndProgress() {
  return (
    <div className="col-2 row-span-2 flex flex-col gap-1.5 p-1">
      <h5 className="text-xs">Name of show/ playlist</h5>
      <ProgressBar max={10} currValue={8} />
    </div>
  );
}

export default RecentNameAndProgress;
