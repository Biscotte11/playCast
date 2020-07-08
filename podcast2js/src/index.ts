import { parseStringPromise } from "xml2js";
import * as yup from "yup";

const itemSchema = yup.object().shape({
  guid: yup.string().defined(),
  title: yup.string().defined(),
  duration: yup.number().integer().positive().defined(),
  image: yup.string().defined(),
});

export type Item = yup.InferType<typeof itemSchema>;

const podcastSchema = yup
  .object()
  .shape({
    title: yup.string().defined(),
    description: yup.string().defined(),
    categories: yup.array().of(yup.string().defined()).defined(),
    link: yup.string().url().defined(),
    image: yup.string().defined(),
    author: yup.string().defined(),
    lastBuildDate: yup.date().defined(),
    items: yup.array().of(itemSchema.defined()).defined(),
  })
  .defined();

export type Podcast = yup.InferType<typeof podcastSchema>;

function first([first]: any[]): any {
  try {
    return first;
  } catch (e) {
    return undefined;
  }
}

function getCategories(categories: any[] = [], prefixes: string[] = []): any[] {
  return categories.flatMap(function (category) {
    const value = category && category.$ && category.$.text;
    const childrenCategories = category["itunes:category"];

    if (childrenCategories) {
      return getCategories(
        childrenCategories,
        prefixes.concat(value ? [value] : []),
      );
    }

    if (value) {
      return [prefixes.concat([value]).join(" > ")];
    }

    return [];
  });
}

function getDuration(duration: string): number | undefined {
  const [seconds = 0, minutes = 0, hours = 0] = duration
    .split(":")
    .map((n) => Number(n))
    .reverse();

  return seconds + minutes * 60 + hours * 3600;
}

export async function parse(feed: string): Promise<Podcast> {
  const podcastAsObject = await parseStringPromise(feed);

  const channel = first(podcastAsObject.rss.channel);

  return podcastSchema.validate({
    title: first(channel.title),
    description: first(channel.description),
    link: first(channel.link),
    image: first(channel["itunes:image"]).$.href,
    author: first(channel.author || channel["itunes:author"]),
    lastBuildDate: first(channel.lastBuildDate),
    categories: getCategories(channel["itunes:category"]),
    items: channel.item.map(function (item: any) {
      return {
        guid: first(item.guid)._,
        title: first(item.title),
        duration: getDuration(first(item["itunes:duration"])),
        image: first(item["itunes:image"]).$.href,
      };
    }),
  });
}
