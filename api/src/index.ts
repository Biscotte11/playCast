import { ApolloServer } from "apollo-server-fastify";
import fastify from "fastify";
import { createContext } from "./context";
import { schema } from "./schema";

const server = new ApolloServer({
  schema,
  context() {
    return createContext();
  },
  tracing: true,
});

const app = fastify();

app.register(server.createHandler({ path: "/" }));

app.listen(7772, function (err, address) {
  if (err) {
    console.error(err);
    return;
  }
  console.log(`Server listen on ${address}`);
});
