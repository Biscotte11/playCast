import { getApplePodcast } from "./apple-podcast";
import { getColorsFromImage } from "./colors-from-image";
import { getPodcast } from "./podcast";
import { getSpotifyPodcast } from "./spotify-podcast";

export function createServices() {
  return {
    getPodcast,
    getColorsFromImage,
    getSpotifyPodcast,
    getApplePodcast,
  };
}

export type Service = ReturnType<typeof createServices>;
