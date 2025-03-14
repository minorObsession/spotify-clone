// ! FOR BOTH VIEWS
import RecentTab from "./RecentTab";

function RecentlyPlayed() {
  const limitNumOfTabs = (array: any[], numTabs = 8): any[] =>
    array.slice(0, numTabs);

  return (
    <div className="flex flex-wrap bg-amber-300 p-2">
      {[1, 2, 3, 4, 5].map((t, i) => (
        <RecentTab key={i} />
      ))}
    </div>
  );
}

export default RecentlyPlayed;
