import sayHelloResolver from "./sayHello.resolver.js";

const resolvers = {
  Query: {
    ...sayHelloResolver.Query,
  },
  Mutation: {
    ...sayHelloResolver.Mutation,
  },
};

export default resolvers;
