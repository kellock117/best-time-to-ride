import AppDataSource from "./data-source";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import "dotenv/config";

import typeDefs from "./graphql/typeDefs/index.typeDefs.js";
import resolvers from "./graphql/resolvers/index.resolver.js";

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

AppDataSource.initialize()
  .then(() => {
    startStandaloneServer(server).then(({ url }) => {
      console.log(`Server ready at ${url}`);
    });
  })
  .catch((error) => console.log(error));
