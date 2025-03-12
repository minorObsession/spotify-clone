// ! FOR BOTH VIEWS
import RecentTab from "./RecentTab";

function RecentlyPlayed() {
  // ! FIND THE 8 MOST RECENTLY PLAYED THINGS AND ONLY RENDER THOSE!! PREFERABLY IN 1 ELEMENT
  return (
    <div className="flex p-2">
      <div className={`flex w-1/2 flex-col bg-amber-300`}>
        <RecentTab>recently p box</RecentTab>
        <RecentTab>recently p box</RecentTab>
        <RecentTab>recently p box</RecentTab>
        <RecentTab>recently p box</RecentTab>
        <RecentTab>recently p box</RecentTab>
        <RecentTab>recently p box</RecentTab>
      </div>
      <div className={`flex w-1/2 flex-col bg-amber-300`}>
        <RecentTab>recently p box</RecentTab>
        <RecentTab>recently p box</RecentTab>
        <RecentTab>recently p box</RecentTab>
        <RecentTab>recently p box</RecentTab>
        <RecentTab>recently p box</RecentTab>
        <RecentTab>recently p box</RecentTab>
      </div>
    </div>
  );
}

export default RecentlyPlayed;
