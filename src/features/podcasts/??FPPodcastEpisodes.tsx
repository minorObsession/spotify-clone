// import { PodcastEpisodeType } from "./podcast";

// function FPPodcastEpisodes({ episodes }: { episodes: PodcastEpisodeType[] }) {
//   return (
//     <div className="flex flex-col gap-2">
//       <h2 className="text-2xl font-bold">Episodes</h2>
//       <div className="flex flex-col gap-4">
//         {episodes.map((episode: PodcastEpisodeType) => (
//           <div
//             key={episode.id}
//             className="flex flex-col gap-1 rounded-md p-4 hover:bg-neutral-800"
//           >
//             <h3 className="font-medium">{episode.name}</h3>
//             <p className="text-sm">{episode.description}</p>
//             <div className="flex items-center gap-2 text-sm">
//               <span>{new Date(episode.releaseDate).toLocaleDateString()}</span>
//               <span>•</span>
//               <span>{Math.round(episode.durationMs / 60000)} min</span>
//             </div>
//           </div>
//         ))}
//       </div>
//     </div>
//   );
// }
// export default FPPodcastEpisodes;
