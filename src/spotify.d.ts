// // src/spotify.d.ts

// declare global {
//   interface Window {
//     onSpotifyWebPlaybackSDKReady: () => void;
//     Spotify: typeof Spotify; // Reference to the Spotify SDK global object
//     spotifyPlayer: Spotify.Player | undefined;
//   }

//   namespace Spotify {
//     export interface Player {
//       connect(): Promise<void>;
//       addListener(event: string, callback: Function): void;
//       player_state: any;
//       device_id: string;
//       volume: number;
//       getOAuthToken(callback: (token: string) => void): void;
//     }

//     export interface Event {
//       type: string;
//       data: any;
//     }
//   }
// }

// // This is necessary to make the global declarations work
// export {};
