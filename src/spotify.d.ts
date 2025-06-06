// src/spotify.d.ts

export namespace SpotifyApi {
  export interface SearchResponse {
    tracks?: {
      href: string;
      items: TrackObject[];
      limit: number;
      next: string | null;
      offset: number;
      previous: string | null;
      total: number;
    };
    artists?: {
      href: string;
      items: ArtistObject[];
      limit: number;
      next: string | null;
      offset: number;
      previous: string | null;
      total: number;
    };
    albums?: {
      href: string;
      items: AlbumObject[];
      limit: number;
      next: string | null;
      offset: number;
      previous: string | null;
      total: number;
    };
    playlists?: {
      href: string;
      items: PlaylistObject[];
      limit: number;
      next: string | null;
      offset: number;
      previous: string | null;
      total: number;
    };
    shows?: {
      href: string;
      items: ShowObject[];
      limit: number;
      next: string | null;
      offset: number;
      previous: string | null;
      total: number;
    };
    episodes?: {
      href: string;
      items: EpisodeObject[];
      limit: number;
      next: string | null;
      offset: number;
      previous: string | null;
      total: number;
    };
    audiobooks?: {
      href: string;
      items: AudiobookObject[];
      limit: number;
      next: string | null;
      offset: number;
      previous: string | null;
      total: number;
    };
  }

  export interface TrackObject {
    album: AlbumObject;
    artists: ArtistObject[];
    available_markets: string[];
    disc_number: number;
    duration_ms: number;
    explicit: boolean;
    external_ids: {
      isrc: string;
      ean: string;
      upc: string;
    };
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    is_playable: boolean;
    linked_from: {
      external_urls: {
        spotify: string;
      };
      href: string;
      id: string;
      type: string;
      uri: string;
    };
    restrictions: {
      reason: string;
    };
    name: string;
    popularity: number;
    preview_url: string | null;
    track_number: number;
    type: string;
    uri: string;
    is_local: boolean;
  }

  export interface ArtistObject {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string | null;
      total: number;
    };
    genres: string[];
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    popularity: number;
    type: string;
    uri: string;
  }

  export interface AlbumObject {
    album_type: string;
    total_tracks: number;
    available_markets: string[];
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    release_date: string;
    release_date_precision: string;
    restrictions: {
      reason: string;
    };
    type: string;
    uri: string;
    artists: ArtistObject[];
  }

  export interface PlaylistObject {
    collaborative: boolean;
    description: string | null;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: ImageObject[];
    name: string;
    owner: UserObject;
    public: boolean | null;
    snapshot_id: string;
    tracks: {
      href: string;
      total: number;
    };
    type: string;
    uri: string;
  }

  export interface ShowObject {
    available_markets: string[];
    copyrights: CopyrightObject[];
    description: string;
    html_description: string;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: ImageObject[];
    is_externally_hosted: boolean;
    languages: string[];
    media_type: string;
    name: string;
    publisher: string;
    type: string;
    uri: string;
    total_episodes: number;
  }

  export interface EpisodeObject {
    audio_preview_url: string | null;
    description: string;
    html_description: string;
    duration_ms: number;
    explicit: boolean;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: ImageObject[];
    is_externally_hosted: boolean;
    is_playable: boolean;
    language: string;
    languages: string[];
    name: string;
    release_date: string;
    release_date_precision: string;
    resume_point: {
      fully_played: boolean;
      resume_position_ms: number;
    };
    type: string;
    uri: string;
    restrictions: {
      reason: string;
    };
  }

  export interface AudiobookObject {
    authors: AuthorObject[];
    available_markets: string[];
    copyrights: CopyrightObject[];
    description: string;
    html_description: string;
    edition: string;
    explicit: boolean;
    external_urls: {
      spotify: string;
    };
    href: string;
    id: string;
    images: ImageObject[];
    languages: string[];
    media_type: string;
    name: string;
    narrators: NarratorObject[];
    publisher: string;
    type: string;
    uri: string;
    total_chapters: number;
  }

  export interface ImageObject {
    url: string;
    height: number | null;
    width: number | null;
  }

  export interface UserObject {
    external_urls: {
      spotify: string;
    };
    followers: {
      href: string | null;
      total: number;
    };
    href: string;
    id: string;
    type: string;
    uri: string;
    display_name: string | null;
  }

  export interface CopyrightObject {
    text: string;
    type: string;
  }

  export interface AuthorObject {
    name: string;
    id: string;
  }

  export interface NarratorObject {
    name: string;
    id: string;
  }
}
