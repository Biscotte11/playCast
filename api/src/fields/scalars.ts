import { asNexusMethod } from "@nexus/schema";
import {
  GraphQLDateTime,
  GraphQLHexColorCode,
  GraphQLURL,
} from "graphql-scalars";

export const Url = asNexusMethod(GraphQLURL, "url");
export const Datetime = asNexusMethod(GraphQLDateTime, "datetime");
export const Color = asNexusMethod(GraphQLHexColorCode, "color");
