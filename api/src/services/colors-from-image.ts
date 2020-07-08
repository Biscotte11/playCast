import { ValidationError } from "apollo-server";
import Dataloader from "dataloader";
import Vibrant from "node-vibrant";

/**
 * INFO:
 * We use dataloader for cache system
 * but as we're doing http request, we can't group them for optimizing.
 * it's why we limit batch size to 1 and handle only 1 url in the dataloader function
 **/

export interface Colors {
  main: string;
  title: string;
  body: string;
}

export const getColorsFromImage = new Dataloader<string, Colors | undefined>(
  function getColorsFromImageLoader(srcs) {
    return Promise.all(
      srcs.map(async function (src) {
        try {
          const palette = await Vibrant.from(src).getPalette();
          const color = palette.Vibrant;

          if (!color) {
            return undefined;
          }

          return {
            main: color.getHex(),
            title: color.getTitleTextColor(),
            body: color.getBodyTextColor(),
          };
        } catch (e) {
          return new ValidationError(
            `Fail to get colors from image: ${src} > ${e.message}`,
          );
        }
      }),
    );
  },
  { maxBatchSize: 1 },
);
