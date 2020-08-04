import fetch from "cross-fetch";
import Dataloader from "dataloader";

interface ItunesApiResult {
  results: Array<{
    collectionName: string;
    collectionViewUrl: string;
  }>;
}

export const getApplePodcast = new Dataloader<string, string | undefined>(
  function getApplePodcastLoader(titles) {
    return Promise.all(
      titles.map(async function (title) {
        const url = `https://itunes.apple.com/search?media=podcast&entity=podcast&term=${encodeURIComponent(
          title,
        )}`;

        const req = await fetch(url);

        const data = (await req.json()) as ItunesApiResult;

        const podcast = data.results.find(function (result) {
          return result.collectionName === title;
        });

        if (podcast) {
          return podcast.collectionViewUrl;
        } else {
          return undefined;
        }
      }),
    );
  },
  { maxBatchSize: 1 },
);
