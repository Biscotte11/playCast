import { connectionPlugin, makeSchema } from "@nexus/schema";
import { resolve } from "path";
import * as fields from "./fields";

export const schema = makeSchema({
  types: Object.values(fields),
  plugins: [
    connectionPlugin({
      includeNodesField: true,
    }),
  ],
  outputs: {
    schema: resolve(__dirname, "./generated/schema.graphql"),
    typegen: resolve(__dirname, "./generated/typings.ts"),
  },
  shouldGenerateArtifacts: process.env.NODE_ENV === "development",
  prettierConfig: require.resolve("@nolanrigo/prettier-config"),
  nonNullDefaults: { output: true, input: true },
  typegenAutoConfig: {
    contextType: "ctx.Context",
    sources: [
      {
        source: resolve(__dirname, "./context.ts"),
        alias: "ctx",
      },
    ],
  },
});
