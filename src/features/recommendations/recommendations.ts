// import { StateStore } from "./store";
// import { StateCreator } from "zustand";

// export interface RecommendationsSlice {
//   recTracks: Record<string, any>[];
//   getRecTracks: (params?: {
//     seed_artists?: string;
//     seed_genres?: string;
//     seed_tracks?: string;
//     limit?: number;
//     market?: string;
//   }) => Promise<void>;
// }

// export const createRecommendationsSlice: StateCreator<
//   StateStore,
//   [["zustand/devtools", never]],
//   [],
//   RecommendationsSlice
// > = (set) => ({
//   recTracks: [],

//   getRecTracks: async ({
//     seed_artists = "4NHQUGzhtTLFvgF5SZesLK",
//     seed_genres = "classical", // Try with just one genre first
//     seed_tracks = "0c6xIDDpzE81m2q797ordA",
//     limit = 20,
//     market = "US",
//   } = {}) => {
//     try {
//       const accessToken = getAccessToken();
//       if (!accessToken)
//         throw new Error("Access token expired or doesn't exist");

//       console.log("Access Token:", accessToken.token);

//       // Build URL parameters more carefully
//       const params = new URLSearchParams();

//       if (seed_artists) params.append("seed_artists", seed_artists);
//       if (seed_genres) params.append("seed_genres", seed_genres);
//       if (seed_tracks) params.append("seed_tracks", seed_tracks);
//       params.append("limit", limit.toString());
//       params.append("market", market);

//       const queryString = params.toString();
//       console.log("Query string:", queryString);

//       const res = await fetch(
//         `https://api.spotify.com/v1/recommendations?${queryString}`,
//         {
//           method: "GET",
//           headers: {
//             Authorization: `Bearer ${accessToken.token}`,
//             "Content-Type": "application/json",
//           },
//         },
//       );

//       console.log("Response Status:", res.status);

//       const responseText = await res.text();
//       console.log("Response Body:", responseText);

//       if (!res.ok) throw new Error(`Request failed with status ${res.status}`);

//       const recs = JSON.parse(responseText);
//       console.log("API Data:", recs);

//       if (!recs.tracks || !Array.isArray(recs.tracks)) {
//         throw new Error("Invalid API response format");
//       }

//       set({ recTracks: recs.tracks });
//     } catch (err) {
//       console.error("🛑 ❌ Error fetching recommendations:", err);
//       set({ recTracks: [] });
//     }
//   },
// });
