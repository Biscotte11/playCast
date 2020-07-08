import Dataloader from "dataloader";
import Spotify from "spotify-web-api-node";

const s = new Spotify({
  clientId: process.env.SPOTIFY_CLIENT_ID,
  clientSecret: process.env.SPOTIFY_CLIENT_SECRET,
});

const markets = [
  "AD",
  "AE",
  "AL",
  "AR",
  "AT",
  "AU",
  "BA",
  "BE",
  "BG",
  "BH",
  "BO",
  "BR",
  "CA",
  "CH",
  "CL",
  "CO",
  "CR",
  "CY",
  "CZ",
  "DE",
  "DK",
  "DO",
  "DZ",
  "EC",
  "EE",
  "ES",
  "FI",
  "FR",
  "GB",
  "GR",
  "GT",
  "HK",
  "HN",
  "HR",
  "HU",
  "ID",
  "IE",
  "IL",
  "IN",
  "IS",
  "IT",
  "JO",
  "JP",
  "KW",
  "LB",
  "LI",
  "LT",
  "LU",
  "LV",
  "MA",
  "MC",
  "ME",
  "MK",
  "MT",
  "MX",
  "MY",
  "NI",
  "NL",
  "NO",
  "NZ",
  "OM",
  "PA",
  "PE",
  "PH",
  "PL",
  "PS",
  "PT",
  "PY",
  "QA",
  "RO",
  "RS",
  "SE",
  "SG",
  "SI",
  "SK",
  "SV",
  "TH",
  "TN",
  "TR",
  "TW",
  "US",
  "UY",
  "VN",
  "XK",
  "ZA",
];

interface SpotifyShow {
  type: "show";
  external_urls: {
    spotify: string;
  };
  id: string;
  name: string;
}

async function findASpotifyShow(
  title: string,
): Promise<SpotifyShow | undefined> {
  for (const market of markets) {
    const result = (await s.search(title, ["show" as any], {
      market,
      limit: 1,
    })) as any;

    const show = result.body.shows.items.find(function (item: any) {
      return item.name === title;
    });

    if (show) {
      return show;
    }
  }

  return undefined;
}

/**
 * INFO:
 * We use dataloader for cache system
 * but as we're doing http request, we can't group them for optimizing.
 * it's why we limit batch size to 1 and handle only 1 url in the dataloader function
 **/

export const getSpotifyPodcast = new Dataloader<
  string,
  SpotifyShow | undefined
>(
  async function getSpotifyPodcastLoader(titles) {
    // Get a new fresh access token
    try {
      const {
        body: { access_token },
      } = await s.clientCredentialsGrant();
      s.setAccessToken(access_token);
    } catch (e) {
      console.error(e);
      throw new Error("Spotify authentication issue");
    }

    return Promise.all(
      titles.map(async function (title) {
        try {
          const show = await findASpotifyShow(title);
          return show;
        } catch (e) {
          return new Error(e);
        }
      }),
    );
  },
  { maxBatchSize: 1 },
);
