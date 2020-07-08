import { Podcast } from "podcast2js";

export type ResourcePodcast = {
  url: string;
  podcast: Podcast;
};

export const rootTyping = {
  name: "ResourcePodcast",
  path: __filename,
};
