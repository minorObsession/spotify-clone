import ProgressBar from "./ProgressBar";

function RecentNameAndProgress() {
  // ! measure chars - when show name too long display 3 dots and only display whole name on hover
  return (
    <div className="col-2 row-span-2 flex flex-[0_1_auto] flex-col justify-around gap-1.5 overflow-hidden p-1 md:p-2">
      <h5 className="truncate text-xs">
        what if this is a
        safjasfklasfklajsfkaasfjsahfjsafjffffasfioasfashofhassfsakhfaslkjfsjfjkash
      </h5>
      <ProgressBar max={10} currValue={8} />
    </div>
  );
}

export default RecentNameAndProgress;
