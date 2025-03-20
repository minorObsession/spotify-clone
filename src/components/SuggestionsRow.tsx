import { useStateStore } from "../state/store";
import Suggestion from "./Suggestion";

interface SuggestionsRowProps {
  title?: string;
  suggestionsData?: [];
}

function SuggestionsRow({ title, suggestionsData }: SuggestionsRowProps) {
  const username = useStateStore((store) => store.username);

  return (
    <div>
      <div className="max-w-screen overflow-x-scroll p-3 md:p-4">
        <h2 className="">
          {/* {title} */}
          {username}
        </h2>
        {/* // ! container */}
        <div className="sw-full flex gap-5 overflow-x-scroll">
          {/* // ! SUGGSTED CARD */}
          {/* {suggestionsData?.map((sugg) => <Suggestion  />)} */}

          <Suggestion />
          <Suggestion />
          <Suggestion />
          <Suggestion />
          <Suggestion />
          <Suggestion />
          <Suggestion />
          <Suggestion />
          <Suggestion />
        </div>
      </div>
    </div>
  );
}

export default SuggestionsRow;
