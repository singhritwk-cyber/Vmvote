export interface VoteSite {
  id: string;
  name: string;
  path: string;
  voteUrl: string;
}

export const voteSites: VoteSite[] = [
  {
    id: "site1",
    name: "Vote Site 1",
    path: "/site1",
    voteUrl: "https://minecraftservers.org/"
  },
  {
    id: "site2",
    name: "Vote Site 2",
    path: "/site2",
    voteUrl: "https://minecraft-server-list.com/"
  },
  {
    id: "site3",
    name: "Vote Site 3",
    path: "/site3",
    voteUrl: "https://topg.org/"
  },
  {
    id: "site4",
    name: "Vote Site 4",
    path: "/site4",
    voteUrl: "https://namemc.com/"
  },
  {
    id: "site5",
    name: "Vote Site 5",
    path: "/site5",
    voteUrl: "https://minecraft-mp.com/"
  },
  {
    id: "site6",
    name: "Vote Site 6",
    path: "/site6",
    voteUrl: "https://planetminecraft.com/"
  }
];
