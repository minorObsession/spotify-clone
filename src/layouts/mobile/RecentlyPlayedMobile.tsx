import RecentTab from "../../components/RecentTab";

function RecentlyPlayedMobile() {
  // const limitNumOfTabs = (array: any[], numTabs = 8): any[] =>
  //   array.slice(0, numTabs);

  return (
    <div className="md: flex flex-wrap bg-amber-300 p-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((t, i) => (
        <RecentTab key={i} />
      ))}
    </div>
  );
}

export default RecentlyPlayedMobile;
