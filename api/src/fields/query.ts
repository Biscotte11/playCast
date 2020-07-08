import { queryType, stringArg } from "@nexus/schema";
import { Podcast } from "./podcast";

export const Query = queryType({
  description: "",
  definition(t) {
    t.field("podcast", {
      type: Podcast,
      description: "",
      args: {
        url: stringArg({
          description: "",
        }),
      },
      async resolve(_, { url }, { getPodcast }) {
        const podcast = await getPodcast.load(url);

        return {
          url,
          podcast,
        };
      },
    });
  },
});
