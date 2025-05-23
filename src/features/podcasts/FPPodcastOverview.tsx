import { PodcastType } from "./podcast";

function FPPodcastOverview({ data }: { data: PodcastType }) {
  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end gap-6">
        <img
          src={data.imageUrl}
          alt={data.name}
          className="h-48 w-48 object-cover shadow-lg"
        />
        <div className="flex flex-col gap-2">
          <span className="text-sm font-medium uppercase">Podcast</span>
          <h1 className="text-4xl font-bold">{data.name}</h1>
          <p className="text-sm">{data.description}</p>
          <div className="flex items-center gap-2">
            <span className="font-medium">{data.publisher}</span>
            <span className="">•</span>
            <span className="">{data.totalEpisodes} episodes</span>
          </div>
        </div>
      </div>
    </div>
  );
}

export default FPPodcastOverview;
