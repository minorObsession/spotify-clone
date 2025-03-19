import RecentTab from "./RecentTab";

function RecentlyPlayedDesktop() {
  // const limitNumOfTabs = (array: any[], numTabs = 8): any[] =>
  //   array.slice(0, numTabs);

  // ! IDEA: md: maybe remove progress bar to be able to spread the title in 2 lines
  return (
    <div className="flex flex-wrap bg-amber-300 p-2 sm:grid-cols-[repeat(2,_minmax(15rem,_1fr))] sm:grid-rows-4 md:grid md:grid-cols-[repeat(4,_minmax(8rem,_1fr))] md:grid-rows-2">
      {[1, 2, 3, 4, 5, 6, 7, 8].map((t, i) => (
        <RecentTab key={i} />
      ))}
    </div>
  );
}

export default RecentlyPlayedDesktop;
