// import AppDataSource from "./src/data-source";
import { ApolloServer } from "@apollo/server";
import { startStandaloneServer } from "@apollo/server/standalone";
import "dotenv/config";

import startJob from "./src/scraping/index.js";
import typeDefs from "./src/graphql/typeDefs/index.typeDefs.js";
import resolvers from "./src/graphql/resolvers/index.resolver.js";

startJob();

const server = new ApolloServer({
  typeDefs,
  resolvers,
});

startStandaloneServer(server).then(({ url }) => {
  console.log(`Server ready at ${url}`);
});
