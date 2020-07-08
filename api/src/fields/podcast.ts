import { objectType } from "@nexus/schema";
import { rootTyping } from "./roots/podcast";

export const Podcast = objectType({
  name: "Podcast",
  rootTyping,
  definition(t) {
    t.url("url", {
      description: "",
      resolve({ url }) {
        return url;
      },
    });
    t.field("colors", {
      type: PodcastColors,
      description: "",
      nullable: true,
      async resolve({ podcast }, _, { getColorsFromImage }) {
        const colors = await getColorsFromImage.load(podcast.image);
        if (colors) {
          return colors;
        } else {
          return null;
        }
      },
    });
    t.string("title", {
      description: "",
      resolve({ podcast }) {
        return podcast.title;
      },
    });
    t.datetime("lastBuild", {
      description: "",
      resolve({ podcast }) {
        return podcast.lastBuildDate;
      },
    });
    t.string("description", {
      description: "",
      resolve({ podcast }) {
        return podcast.description;
      },
    });
    t.list.string("categories", {
      description: "",
      resolve({ podcast }) {
        return podcast.categories;
      },
    });
    t.url("link", {
      description: "",
      resolve({ podcast }) {
        return podcast.link;
      },
    });
    t.field("thumbnail", {
      type: PodcastImage,
      description: "",
      resolve({ podcast }) {
        return { src: podcast.image };
      },
    });
    t.field("author", {
      type: PodcastAuthor,
      description: "",
      resolve({ podcast }) {
        return {
          fullname: podcast.author,
        };
      },
    });
    t.field("players", {
      type: PodcastPlayers,
      description: "",
      resolve: (n) => n,
    });
    t.connectionField("episodes", {
      type: Episode,
      disableBackwardPagination: true,
      cursorFromNode({ id }, { after, first }) {
        return `${id}:${first}:${after}`;
      },
      nodes({ podcast }) {
        return podcast.items.map(function ({ guid, title, duration, image }) {
          return { id: guid, title, duration, thumbnail: { src: image } };
        });
      },
      extendConnection(t) {
        t.int("totalCount", {
          description: "",
          async resolve({ nodes }) {
            return (await nodes).length;
          },
        });
      },
    });
  },
});

export const PodcastColors = objectType({
  name: "PodcastColors",
  definition(t) {
    t.color("main", { description: "" });
    t.color("title", { description: "" });
    t.color("body", { description: "" });
  },
});

export const PodcastImage = objectType({
  name: "PodcastImage",
  definition(t) {
    t.url("src", { description: "" });
  },
});

export const PodcastAuthor = objectType({
  name: "PodcastAuthor",
  definition(t) {
    t.string("fullname", { description: "" });
  },
});

export const PodcastPlayers = objectType({
  name: "PodcastPlayers",
  rootTyping,
  definition(t) {
    t.url("rss", {
      description: "",
      resolve({ url }) {
        return url;
      },
    });
    t.url("spotify", {
      description: "",
      async resolve({ podcast }, _, { getSpotifyPodcast }) {
        const show = await getSpotifyPodcast.load(podcast.title);
        if (show) {
          return show.external_urls.spotify;
        } else {
          return null;
        }
      },
    });
    t.url("applePodcast", {
      description: "",
      async resolve({ podcast }, _, { getApplePodcast }) {
        const podcastUrl = await getApplePodcast(podcast.title);

        return podcastUrl;
      },
    });
  },
});

export const Episode = objectType({
  name: "Episode",
  definition(t) {
    t.id("id", { description: "" });
    t.string("title", { description: "" });
    t.int("duration", { description: "Episode duration in second" });
    t.field("thumbnail", { type: PodcastImage, description: "" });
  },
});
