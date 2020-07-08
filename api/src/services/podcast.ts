import { ValidationError } from "apollo-server";
import fetch from "cross-fetch";
import Dataloader from "dataloader";
import { parse, Podcast } from "podcast2js";

/**
 * INFO:
 * We use dataloader for cache system
 * but as we're doing http request, we can't group them for optimizing.
 * it's why we limit batch size to 1 and handle only 1 url in the dataloader function
 **/

export const getPodcast = new Dataloader<string, Podcast>(
  function getPodcastLoader(urls) {
    return Promise.all(
      urls.map(async function (url) {
        try {
          const req = await fetch(url);
          const feed = await req.text();
          const podcast = await parse(feed);
          return podcast;
        } catch (e) {
          return new ValidationError(
            `Fail to parse podcast: ${url} > ${e.message}`,
          );
        }
      }),
    );
  },
  { maxBatchSize: 1 },
);
