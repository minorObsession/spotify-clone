import { StateCreator } from "zustand";
import { StateStore } from "../../state/store";
import { fetchFromSpotify } from "../../state/helpers";
import { TopTrackType } from "../artists/artist";

const searchAllIfNotFiltered =
  "track,artist,album,playlist,show,episode,audiobook";

export type SearchFiltersType =
  | typeof searchAllIfNotFiltered
  | "track"
  | "artist"
  | "album"
  | "playlist"
  | "show"
  | "episode"
  | "audiobook";

interface ShortArtistType {
  name: string;
  imageUrl: string;
  id: string;
}

interface ShortAlbumType {
  name: string;
  imageUrl: string | undefined;
  releaseYear: string;
  artists: {
    name: string;
    id: string;
  }[];
}

interface ShortPlaylistType {
  name: string;
  imageUrl: string;
  id: string;
}

interface ShortShowType {
  name: string;
  imageUrl: string;
  id: string;
}

interface ShortEpisodeType {
  name: string;
  imageUrl: string;
  id: string;
  releaseDate: string;
}

interface ShortAuthorType {
  name: string;
  id: string;
}

interface ShortAudiobookType {
  name: string;
  imageUrl: string;
  id: string;
  authors: ShortAuthorType[];
}

// ! fix these any types!!!
export type SearchResultType = {
  artists: ShortArtistType[];
  albums: ShortAlbumType[];
  playlists: ShortPlaylistType[];
  shows: ShortShowType[];
  episodes: ShortEpisodeType[];
  audiobooks: ShortAudiobookType[];
};

export type TopResultType = {
  imageUrl: string;
  name: string;
  id: string;
  topTracks: TopTrackType[];
};

export interface SearchSlice {
  searchResults: SearchResultType | null;
  searchFilters: SearchFiltersType;
  setSearchFilters: (filterBy: SearchFiltersType) => void;
  topResult: null | TopResultType;
  searchOffset: number;
  searchLimit: number;
  search: (query: string) => Promise<SearchResultType>;
}

const tempTopResult = {
  imageUrl: "https://i.scdn.co/image/ab6761610000e5eb1a9d9662bfeb81f1c46c0ac9",
  name: "Milky Chance",
  id: "1hzfo8twXdOegF3xireCYs",
  topTracks: [
    {
      name: "Stolen Dance",
      id: "0ZfByLXCeKchuj7zi1CJ0S",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273266539b00fd32cbcb7579f6c",
      trackDuration: 313626,
    },
    {
      name: "Flashed Junk Mind",
      id: "2UAWVtEwFLJqdJsT8FCzKX",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273266539b00fd32cbcb7579f6c",
      trackDuration: 261973,
    },
    {
      name: "Down By The River",
      id: "5U0AcKclgf0AbG11AUFLht",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273266539b00fd32cbcb7579f6c",
      trackDuration: 240973,
    },
    {
      name: "Cocoon",
      id: "6acDlNeA06MCVCzsTVGr9V",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2734cc39dafa77f92ee0cc35cf8",
      trackDuration: 255160,
    },
    {
      name: "Living In A Haze",
      id: "6vu5xJWIvukCK8cwBXOOj0",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b27384e9e803499a83ff405f8034",
      trackDuration: 173369,
    },
    {
      name: "Synchronize",
      id: "3GXgrEjBjonrQrPEEi13yU",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2739e8a543b2c7aa388a088c2ca",
      trackDuration: 164576,
    },
    {
      name: "Colorado",
      id: "35iR1qzexmbcUSgA01S4gI",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273cb3aad7083b27bd6c77d9ade",
      trackDuration: 174347,
    },
    {
      name: "Unknown Song",
      id: "2zR85boqjMOKPygjdDbGbC",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273b4e93c36d290f43885578bfd",
      trackDuration: 250521,
    },
    {
      name: "Don't Let Me Down",
      id: "5hsOIinKbxVIVIggR55OAQ",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2737902f8291faaf747063ec1b2",
      trackDuration: 200391,
    },
    {
      name: "Passion",
      id: "6DD3DloL8AvZCI64707q5F",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2731a984577ed0f792e7e33ecfe",
      trackDuration: 187009,
    },
  ],
};

const tempSearchResults = {
  artists: [
    {
      name: "Milky Chance",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5eb1a9d9662bfeb81f1c46c0ac9",
      id: "1hzfo8twXdOegF3xireCYs",
    },
    {
      name: "Milk & Sugar",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebc9e2d505f53ed48934191c06",
      id: "159cwGtgCzNpyHWY6tzihH",
    },
    {
      name: "millkzy",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebdfcf8eb22efb964b7752aa5a",
      id: "7sxM2gRejxUDw7fKtCISzR",
    },
    {
      name: "Miilkbone",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5eb6b4ceccbce57a3b340bc3ba9",
      id: "4Bfff7gPcz7DcDiSdjX6LY",
    },
    {
      name: "Go-Jo",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebf5d6dfc08fedfcb55422b265",
      id: "7CslUrDCYnm3vMtKZJZGNv",
    },
    {
      name: "Milkman",
      imageUrl:
        "https://i.scdn.co/image/019de8f37893f09191af70cda670ab2702bd9b89",
      id: "30cKuCL2eREKcQ8NqyXUo7",
    },
    {
      name: "Rattlesnake Milk",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebc345a61dc3e3986e23414098",
      id: "5ZTPO2c4BmAwr7Swe0qRQc",
    },
    {
      name: "Milky",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5eb5f63defc13083b8dd072ee84",
      id: "5AvCP5qzxTmk4cQmh0SUEw",
    },
    {
      name: "Milk Inc.",
      imageUrl:
        "https://i.scdn.co/image/3f1630054cfcfcaf05ef426222fbc20902e5085e",
      id: "2sgikskblKZFbDpsYO9anB",
    },
    {
      name: "MILKBLOOD",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebf48311fdf30765723370327e",
      id: "7sLejq7H0gfGlhiLUTs4ME",
    },
    {
      name: "Milk Krayt",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5eb63dab00c9d84e2ba9a91a52b",
      id: "0AWeVlo9qXjhPmLflKqikp",
    },
    {
      name: "Milk Talk",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5eb3d51a339facd24ec1d3d7bf9",
      id: "739rlT7CS6nZDmGB9Y9qCR",
    },
    {
      name: "Miley Cyrus",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebf4cccd14ec026038d713e353",
      id: "5YGY8feqx7naU7z4HrwZM6",
    },
    {
      name: "Milk & Bone",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebc36b5e0d003f7f81a14df626",
      id: "4fmvA5uVlZUNsje29D1PaW",
    },
    {
      name: "Milk In The Microwave",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5eb63402687875a81c2db6e7812",
      id: "2Gt30Dr76JrHbGnBf4K9e0",
    },
    {
      name: "Mac Miller",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebed3b89aa602145fde71a163a",
      id: "4LLpKhyESsyAXpc4laK94U",
    },
    {
      name: "Milkyway Outcast",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273cc85b2aa2cd6c6a026cc7caa",
      id: "5GbSgn9UkP5Jr50YW6MpYx",
    },
    {
      name: "alan vuong",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebda506a649da5588923a77f85",
      id: "6y1PHaUMkFXcJNhIAmjAk8",
    },
    {
      name: "Nobu Woods",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebb1f309fcf22cd938b2c0a888",
      id: "5ALcXwMBh6MxbInMWmHElC",
    },
    {
      name: "Milkoi",
      imageUrl:
        "https://i.scdn.co/image/ab6761610000e5ebaa5621839a04d1749fdc0770",
      id: "1k5UEOU4igPC0NoHjEekha",
    },
  ],
  albums: [
    {
      name: "Milkshake 20 (Alex Wann Remix)",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2736a31f70030d3de5fd9b843b6",
      releaseYear: "2023",
      artists: [
        {
          name: "Kelis",
          id: "0IF46mUS8NXjgHabxk2MCM",
        },
        {
          name: "Alex Wann",
          id: "6PTNNcLg90Kkl89JcEwKhT",
        },
      ],
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b27368f293063be4acacec4f983f",
      releaseYear: "2023",
      artists: [
        {
          name: "Cyan Vouge",
          id: "608RIxDzDE2Q4qU27tyti4",
        },
      ],
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2735098e0093ce39f4534c048aa",
      releaseYear: "2022",
      artists: [
        {
          name: "Cushy",
          id: "6L1Baujfn33sG3PXou8n1q",
        },
        {
          name: "Ballpoint",
          id: "5vbgY6zVUKz1haJv618QvC",
        },
      ],
    },
    {
      name: "Sadnecessary (Bonus Track Version)",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273266539b00fd32cbcb7579f6c",
      releaseYear: "2014",
      artists: [
        {
          name: "Milky Chance",
          id: "1hzfo8twXdOegF3xireCYs",
        },
      ],
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273f6a08529d790f0d7e2de31f8",
      releaseYear: "2017",
      artists: [
        {
          name: "NASAYA",
          id: "5932gYdqLCu1ftKVXf1PO4",
        },
        {
          name: "Myra Molloy",
          id: "30yozRF4B2uaL6eDBsLH96",
        },
      ],
    },
    {
      name: "Strawberry Milk.",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2734b84c0117d023603a0117ab5",
      releaseYear: "2025",
      artists: [
        {
          name: "Loaf.",
          id: "51WJVL4QX5nPj9hndguCE5",
        },
      ],
    },
    {
      name: "Milk & Kisses",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b27372794a02454878876b884db9",
      releaseYear: "1996",
      artists: [
        {
          name: "Cocteau Twins",
          id: "5Wabl1lPdNOeIn0SQ5A1mp",
        },
      ],
    },
    {
      name: "Milkshake Man",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273333a58777ce994c9cc6f238c",
      releaseYear: "2025",
      artists: [
        {
          name: "Go-Jo",
          id: "7CslUrDCYnm3vMtKZJZGNv",
        },
      ],
    },
    {
      name: "milk cassette x.mp3 (slowed + reverb)",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273d3f555f3655b8f5ff3082ee0",
      releaseYear: "2022",
      artists: [
        {
          name: "analog_mannequin",
          id: "5BnokxEB4VXeS1359upGtH",
        },
      ],
    },
    {
      name: "Milk And Honey",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2734a82d19a6315bad34b34be61",
      releaseYear: "1984",
      artists: [
        {
          name: "John Lennon",
          id: "4x1nvY2FN8jxqAFA0DA02H",
        },
        {
          name: "Yoko Ono",
          id: "2s4tjL6W3qrblOe0raIzwJ",
        },
      ],
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b27312aea09003ac506977731dbc",
      releaseYear: "2022",
      artists: [
        {
          name: "Hicks",
          id: "7o25rnG6F8ccCGxmyGY5mV",
        },
      ],
    },
    {
      name: "Vibrant Green",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b27320b801ed087006dad225a359",
      releaseYear: "2025",
      artists: [
        {
          name: "Lofi Milk",
          id: "19hKMqNrak7eZjlcgnjgtT",
        },
      ],
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b27340fd73e7af2e16c2ee508367",
      releaseYear: "2023",
      artists: [
        {
          name: "Abby Sage",
          id: "4aej3kKLxSLM0WauTSfZ7k",
        },
      ],
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273a42553362225c36e03a484ad",
      releaseYear: "2017",
      artists: [
        {
          name: "The 1975",
          id: "3mIj9lX2MWuHmhNCA7LSCW",
        },
      ],
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2730735b9b1d06b65bbd8814825",
      releaseYear: "2015",
      artists: [
        {
          name: "Goose house",
          id: "7BzEKSgHp2yrNC6w5NkFhQ",
        },
      ],
    },
    {
      name: "milk cassette x.mp3",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b27333301a04c9ccf1033f19135c",
      releaseYear: "2021",
      artists: [
        {
          name: "analog_mannequin",
          id: "5BnokxEB4VXeS1359upGtH",
        },
      ],
    },
    {
      name: "Milky Way",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273929cd00911b0f5b6a4448d15",
      releaseYear: "2025",
      artists: [
        {
          name: "Alberto Continentino",
          id: "32On9aT0OV5VSV0053B3hE",
        },
      ],
    },
    {
      name: "Milky Way",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273267158422744961d90e942b3",
      releaseYear: "2018",
      artists: [
        {
          name: "Bas",
          id: "70gP6Ry4Uo0Yx6uzPIdaiJ",
        },
      ],
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b2737af7fb772ed154bceb06c3d1",
      releaseYear: "2025",
      artists: [
        {
          name: "fakemink",
          id: "0qc4BFxcwRFZfevTck4fOi",
        },
      ],
    },
    {
      name: "Milk & Honey",
      imageUrl:
        "https://i.scdn.co/image/ab67616d0000b273dc07197a2e41e70a41742c51",
      releaseYear: "2021",
      artists: [
        {
          name: "Crowder",
          id: "39xmI59WrIMyyJjSDq6WCu",
        },
      ],
    },
  ],
  playlists: [
    {
      name: "2000's Booty Shakers",
      imageUrl:
        "https://mosaic.scdn.co/640/ab67616d00001e023ba0e7112f965bfda72b1c5bab67616d00001e02aa119fab1d342e3a7e4ddb2cab67616d00001e02abba73f5c24c0066908196e1ab67616d00001e02f7f74100d5cc850e01172cbf",
      id: "634akEbNkMXZy9WRM5qIiT",
    },
    {
      name: "BEST OF MILKY CHANCE",
      imageUrl:
        "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000d72c1dfc0499278dfe94c31e79bf",
      id: "01TGw1oZTmnnfeZdEsxC4e",
    },
    {
      name: "Milkman – Mashups",
      imageUrl:
        "https://i.scdn.co/image/ab67616d00001e02aaf4a28c8ecb349a9a1d09ef",
      id: "01HMXIuNUi3M1JWKt35scd",
    },
    {
      name: "my milkshake brings all the boys to the yard and they're like it's better than yours",
      imageUrl:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84175a41d4112f73e1d5c97007",
      id: "0qDr8AJlCZs6jSiDhTPfNw",
    },
    {
      name: "🐾Therian Playlist🍂 (but the songs are actually relatable for therians)",
      imageUrl:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84cc237e144670864cfdf2df1e",
      id: "0dkTHq8CMmDXRebdImApQY",
    },
    {
      name: "Una Triple Lavada pa Loquear ",
      imageUrl:
        "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da8440f09b37748e94dd28ad7819",
      id: "3s4jlQ0FNl5ocSChtM2Eiy",
    },
    {
      name: "oat milk lattes in the mountains",
      imageUrl:
        "https://image-cdn-fa.spotifycdn.com/image/ab67706c0000da847adcd9ae5c8a7d7520e1111e",
      id: "2IbPrDIVfPmxZF6akHnj8R",
    },
    {
      name: "Milkshake - Remix",
      imageUrl:
        "https://i.scdn.co/image/ab67616d00001e02b294d4752560ed7f4d3fd0d0",
      id: "7sTuHPuS772utu85lA6iba",
    },
    {
      name: "Milkshake - Remix",
      imageUrl:
        "https://i.scdn.co/image/ab67616d00001e02b294d4752560ed7f4d3fd0d0",
      id: "4IkUjh2eP0f2vcdcclkUGy",
    },
    {
      name: "✶  shadow milk cookie (but it's accurate)",
      imageUrl:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72c7ddeabb2966721620efc0204",
      id: "6lgUBZOQ90uX18Omkp4I0g",
    },
    {
      name: "Retro | From The Sidelines",
      imageUrl:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000da84afa42d66a12a9fed0235e4fa",
      id: "0snFtSvokWIcPVSb62VXIy",
    },
    {
      name: "book reading playlist",
      imageUrl:
        "https://image-cdn-ak.spotifycdn.com/image/ab67706c0000d72cfd45b0ead1d1b84229d789a7",
      id: "1NeELYrxr2fBVK3g0bTqOz",
    },
  ],
  shows: [
    {
      name: "The Milk Road Show",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8aa13a83b1440008d44f99e02a",
      id: "4kjIjZ7gBNgbYasqLQJEEy",
    },
    {
      name: "Christopher Kimball’s Milk Street Radio",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a9e2e5881c4f592f5c2ab9da0",
      id: "7psQrMbKQ0vgx6HeEtK1gM",
    },
    {
      name: "The Milk Minute- A Lactation Podcast",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8ac1fde638583841e35a9e703e",
      id: "4to4Mu1wGtFbh3GNUn3ih9",
    },
    {
      name: "MILKLESS",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a04980bf6b1e608a3968cf49d",
      id: "0J5tDAFjBDXdREGBaMfBE0",
    },
    {
      name: "Milkhouse Podcast",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8afa5fff6e42ce088e2ffc0588",
      id: "30QV4v4dunDGYvhtzVJ3zW",
    },
    {
      name: "Choiceology with Katy Milkman",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a2a45062f7a65bd9008bc6ad6",
      id: "5eEQ5hd4CfpsYkfZZi136a",
    },
    {
      name: "Metaphysical Milkshake with Rainn & Reza",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8af898ffc961b9d574d5abfe6b",
      id: "0zUGqUkBdL3Cc5IP8DtUEY",
    },
    {
      name: "M.I.L.K.",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8adf96183debd127b0c3921f67",
      id: "5tXYOd7VHLEoZX0gGT0QTq",
    },
    {
      name: "M.I.L.K. ",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a7364429a3ef1c41903195de0",
      id: "5HOrQdbZQQzlUSVXcpOX4T",
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a92f5ccd63c80e4a9f0589d9f",
      id: "2AFyfRn7aW2wtjbQXUXm16",
    },
    {
      name: "Milkshakes and Ghosts",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8aa79cf63486fe32e09f9ee8a5",
      id: "2i6oqMd3yfildR5E1Es8Cf",
    },
    {
      name: "Spilled Milk",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a3f581040fe18bd7ec248c004",
      id: "6ENnZG3XTB5XeByz4b1ecj",
    },
    {
      name: "Strawberry Milk POD",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a6f68305e0a01b1976950537f",
      id: "1SGcVKJJcUFVX8HVuIWLl9",
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a832b354d3204c3889bf60e11",
      id: "0nmRctfNGvVJFD1xGPtNGT",
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a5a15f02f6017d00554d59954",
      id: "0Xbl7mTCU9MKoHz3wLOwy6",
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a40aa635bb565cbcaf1274415",
      id: "2FLjDOXEE9Ub3gmSOKCb3V",
    },
    {
      name: "And That's Why We Drink",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a04a8d00641792ae00c2a3549",
      id: "3JWnH3U4VPJI6DlB0YsiKm",
    },
    {
      name: "[👥🥛🍪] 💙♤Shadow♡Milk◇Cookie♧💙",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a118b65eceb3effb1a685094b",
      id: "6FZqzUCjREgq6LibhF5eNL",
    },
    {
      name: "Milk",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a1dc2acd1f085595e0c5e3147",
      id: "4HR71xjV04lKTEpOBjb3fB",
    },
    {
      name: "Milk🥛🐄",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8aa932767769e91f9e64fca68d",
      id: "44HDTukXCTVpm3icLt3Yjc",
    },
  ],
  episodes: [
    {
      name: "Secrets of Restaurant Design: An Insider Tells All",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a549f10d6572ac3f7a80d3d7d",
      id: "6pDl7OXH89Z2ANeQsxPF34",
      releaseDate: "2025-05-16",
    },
    {
      name: "170: The Shocking Truth About Dairy: Why are we *really* drinking milk?",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a650739bb72e9074e6d3df723",
      id: "5lcz9f1sIPI3Qc8Tzfy7Yn",
      releaseDate: "2025-05-21",
    },
    {
      name: "Milk & Cookies (PODCAST EXCLUSIVE EPISODE)",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8abe297ca5fd2c3f63b1c9403c",
      id: "1Pd5JtmjQHJuKD9CqotBIT",
      releaseDate: "2022-05-02",
    },
    {
      name: "Wait…Is Whole Milk Actually Good for You Now?",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a042ef73edc30a12dff118166",
      id: "6HnDkS5bdPxzfCE8Og6Mlv",
      releaseDate: "2025-05-20",
    },
    {
      name: "Milkshake",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8adb3a34a2602dfd4a1f096be2",
      id: "37iUXGfnzVzmBcNdrjQiyY",
      releaseDate: "2024-12-23",
    },
    {
      name: 'Government Cheese Tunnels & The "Got Milk?" Conspiracy',
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8adee1f66c882cee83653440f1",
      id: "47iwp14CtiRmMs1bWQWEOG",
      releaseDate: "2024-05-13",
    },
    {
      name: "Draft Of Animals For A Basketball Team, Twix Chocolate Milk Taste Test, And Q’s From The Sticks",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8aca5f4be8af3fef8b5b13e2b7",
      id: "1nTEQWnsbtSaA1YNZh5Fxo",
      releaseDate: "2025-05-13",
    },
    {
      name: "Ep 174 What’s the deal with raw milk: Part 1",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a64e30177c9c99e8f03afcf6f",
      id: "4WP5lt1qAayLwY0FJoFEnq",
      releaseDate: "2025-04-29",
    },
    {
      name: "#126 ZACH DRINKS BREAST MILK?!",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a2082134c9cc41aaea1e5d551",
      id: "3UY9p9x6JVVNwvXeqQXcms",
      releaseDate: "2025-04-03",
    },
    {
      name: "Eurovision feast: Poison Cake, Milkshake Man, and Espresso Macchiato (featuring Tommy Cash)",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8abb804bbe116ca8c777b5a487",
      id: "1tPFiTtuDxQIQPO8ncMwqR",
      releaseDate: "2025-05-06",
    },
    {
      name: "Oh God My Phone",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8af7cc7c7b666500c0908d51d6",
      id: "2WwIJC7fZC36700o7KwgyF",
      releaseDate: "2025-05-20",
    },
    {
      name: "Thursday, April 24th, 2025 - VP’s Ukraine push; Admin cuts hit milk tests, LGBTQ crisis line & Head Start; Tariff lawsuits; Weinstein retrial & more",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8adc749a3a8db452e62e5bb4be",
      id: "2zD7hzX99AJwuUnEYU6Jiq",
      releaseDate: "2025-04-24",
    },
    {
      name: "1 hour loop of shadow milk cookie saying “so shiny so strong”",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8ac02b69a77864227c685bf21e",
      id: "7y3wDUdobBSVZuh2mWxtco",
      releaseDate: "2025-02-28",
    },
    {
      name: "Michael Milken: When Junk Was King | 157",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8ad52e77a5844deee68aa3cd47",
      id: "3XxKMKsUiTQsZjjKH3yHOL",
      releaseDate: "2025-05-05",
    },
    {
      name: "shadow milk cookie's iconic voicelines ",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8ac02b69a77864227c685bf21e",
      id: "2qCFKCCcxLn4XgvGcc1SLu",
      releaseDate: "2025-02-22",
    },
    {
      name: "Ep 175 What’s the deal with raw milk: Part 2",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a64e30177c9c99e8f03afcf6f",
      id: "6SuUtXXmlYahcTHsn53mi4",
      releaseDate: "2025-05-06",
    },
    {
      name: "Brendan Schaub wants to Milk Something | TFATK Ep. 1078",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8ab0557de129d4d0f340ca214d",
      id: "2rRZKhwCwaBuOPYQXUIWr1",
      releaseDate: "2025-04-08",
    },
    {
      name: "How To Milk Your Dinosaur",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8ada06252f65bcf7eccd282099",
      id: "2kBrKur4x92mRuepm6kaTT",
      releaseDate: "2024-03-18",
    },
    {
      name: "The Bunt Ft. Digby S21 Episode 06 “I despise milk.”",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8ac9597c76febcb46791e800a3",
      id: "59JTvKs9BRCYkcDAjUx4vW",
      releaseDate: "2025-05-14",
    },
    {
      name: "202: 4 Years Deep.. ",
      imageUrl:
        "https://i.scdn.co/image/ab6765630000ba8a9ecf81b37a35402cc414073a",
      id: "3WB2Z4djMNnR1XoLALKBir",
      releaseDate: "2025-02-06",
    },
  ],
  audiobooks: [
    {
      name: "Milk Fed: A Novel",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a86b878fa518e01313134b3bb1",
      id: "1KfGKqTSk74vlhEnOqEbCe",
      authors: [],
    },
    {
      name: "Milkman",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a83d5b0319dac823b59d005bdb",
      id: "7MS0wEtsHGXXKO34vpd4Lx",
      authors: [],
    },
    {
      name: "Neutral Milk Hotel's In the Aeroplane Over the Sea",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a83b8ffe0039b91b1fb0474dbd",
      id: "1ssowAJzSod8vYmO9tNoMk",
      authors: [],
    },
    {
      name: "Morning Glory Milking Farm",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a8956789d6b0bc1c6e89a2c757",
      id: "7Lipxmf16Zz7odiDSGuBdN",
      authors: [],
    },
    {
      name: "Milk and Honey",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a890f790ed667aeefba75b1a61",
      id: "3ZR5zHwuQ7j0jTCqB8npgI",
      authors: [],
    },
    {
      name: "Land of Milk and Honey: A Novel",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a807fff40b0e2291cf1bfe7379",
      id: "75joz3v0CFz9XVUZRaLuMQ",
      authors: [],
    },
    {
      name: "Milkweed",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a87887a9ee38d468743c43a548",
      id: "6bqcHuv2MkCwGQ8Sxmmy51",
      authors: [],
    },
    {
      name: "The Face on the Milk Carton",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a80d00f110076b824ec4eb75da",
      id: "7zQ41ZV3U34ROyukzkvSQU",
      authors: [],
    },
    {
      name: "Skeleton Crew: Stories",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a80615c2bee62db073abc2ff18",
      id: "143chgCOKKtMh4032gUD8w",
      authors: [],
    },
    {
      name: "Under Milk Wood (2003)",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a8e84786e72ae2fc846c32dfb2",
      id: "5Y0sbc407lbeOQ4LIoxIBx",
      authors: [],
    },
    {
      name: "How Not to Die: Discover the Foods Scientifically Proven to Prevent and Reverse Disease",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a8861aa5e3e7f2a2a6a7173c1b",
      id: "1AnQBFOqjK3PvHaWo63GtD",
      authors: [],
    },
    {
      name: "The Universe",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a8b0853e21d25ff9b2ded29dd3",
      id: "2sGyVweIlj83jCS6R1HuyF",
      authors: [],
    },
    {
      name: "The Milky Way: An Autobiography of Our Galaxy",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a8019b1273787c50144eb46ff1",
      id: "1hHGl9z2ywykRxzDC4AuLN",
      authors: [],
    },
    {
      name: "小説紹介マガジン「My Milky Way」創刊号",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a8334e0c76377f78f90953b54a",
      id: "1JjyIT2dLLPZaC0N4mWCgV",
      authors: [],
    },
    {
      name: "Under Milk Wood: A BBC Radio full-cast production",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a85583e257ce57218af970d051",
      id: "0rX4OTNZQM7TOzMq7uWPqo",
      authors: [],
    },
    {
      name: "Milk Soaps: The Ultimate Guide to Natural Milk Soap-Making Using Goat, Cow, Coconut, or Almond Milk",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a8bcf4c83ebe3aa42cb7818b36",
      id: "5GlnCmHQdA1i3gbTosHHcw",
      authors: [],
    },
    {
      name: "Fortunately, the Milk",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a85753530f8a7e1e58e85f8d78",
      id: "28lepmxvD0oej3WvuUczHs",
      authors: [],
    },
    {
      name: "Extended Summary - Spilled Milk: Based On The Book By K.L. Randis",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a869d3f4e7a6ede7e0a6c5bfac",
      id: "6BiY142JipJVsksBdjXIMI",
      authors: [],
    },
    {
      name: "Den of Thieves",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a8483388eb3eefa8bf0e5fe04e",
      id: "5XyZ9lt5aGSVISl6wvmLNd",
      authors: [],
    },
    {
      name: "How To Make A Grimace Milkshake",
      imageUrl:
        "https://i.scdn.co/image/ab676663000022a83d2eb5e8582e4ddc5ada215a",
      id: "5Dhyb0HLukadYbCFYRTJY6",
      authors: [],
    },
  ],
};

export const createSearchSlice: StateCreator<
  StateStore,
  [["zustand/devtools", never]],
  [],
  SearchSlice
> = (set, get) => ({
  searchResults: tempSearchResults,
  searchFilters: searchAllIfNotFiltered,
  setSearchFilters: (filterBy) => set({ searchFilters: filterBy }),
  topResult: tempTopResult as TopResultType,
  searchOffset: 0,
  searchLimit: 20,
  // ! implement debounced auto search for production
  search: async (query) => {
    try {
      console.log("search callled... ");
      const { searchOffset, searchLimit } = get();

      const result = await fetchFromSpotify<any, SearchResultType>({
        endpoint: `search?q=${query}&type=${searchAllIfNotFiltered}&offset=${searchOffset}&limit=${searchLimit}`,
        transformFn: (data: any) => ({
          artists: data.artists?.items
            .filter(
              (artist: any) =>
                artist && artist.name && artist.images?.[0]?.url && artist.id,
            )
            .map((artist: any) => ({
              name: artist.name,
              imageUrl: artist.images[0].url,
              id: artist.id,
            })),
          albums: data.albums?.items
            .filter(
              (album: any) =>
                album && album.name && album.release_date && album.artists,
            )
            .map((album: any) => ({
              name: album.name,
              imageUrl: album.images?.[0]?.url,
              releaseYear: album.release_date.split("-")[0],
              artists: album.artists
                .filter((artist: any) => artist && artist.name && artist.id)
                .map((artist: any) => ({
                  name: artist.name,
                  id: artist.id,
                })),
            })),
          playlists: data.playlists?.items
            .filter(
              (playlist: any) =>
                playlist &&
                playlist.name &&
                playlist.images?.[0]?.url &&
                playlist.id,
            )
            .map((playlist: any) => ({
              name: playlist.name,
              imageUrl: playlist.images[0].url,
              id: playlist.id,
            })),
          shows: data.shows?.items
            .filter(
              (podcast: any) =>
                podcast &&
                podcast.name &&
                podcast.images?.[0]?.url &&
                podcast.id,
            )
            .map((podcast: any) => ({
              name: podcast.name,
              imageUrl: podcast.images[0].url,
              id: podcast.id,
            })),
          episodes: data.episodes?.items
            .filter(
              (episode: any) =>
                episode &&
                episode.name &&
                episode.images?.[0]?.url &&
                episode.id,
            )
            .map((episode: any) => ({
              name: episode.name,
              imageUrl: episode.images[0].url,
              id: episode.id,
              releaseDate: episode.release_date,
            })),
          audiobooks: data.audiobooks?.items
            .filter(
              (audiobook: any) =>
                audiobook &&
                audiobook.name &&
                audiobook.images?.[0]?.url &&
                audiobook.id,
            )
            .map((audiobook: any) => ({
              name: audiobook.name,
              imageUrl: audiobook.images[0].url,
              id: audiobook.id,
              authors:
                audiobook.authors
                  ?.filter((author: any) => author && author.name && author.id)
                  .map((author: any) => ({
                    name: author.name,
                    id: author.id,
                  })) || [],
            })),
        }),
        onDataReceived: (data) => {
          set({ searchResults: data });
        },
      });

      // call top tracks for 1st artist
      const topTracks = await get().getTopTracks(result.artists[0].id);
      const searchResults = get().searchResults;
      if (!topTracks) return result;
      if (!searchResults) return result;

      const topResultToStore: TopResultType = {
        imageUrl: searchResults.artists[0].imageUrl,
        name: searchResults.artists[0].name,
        id: searchResults.artists[0].id,
        topTracks: topTracks,
      };
      set({ topResult: topResultToStore });
      return result;
    } catch (err) {
      console.error("❌🛑 search error:", err);
      throw err;
    }
  },
});
