import sayHelloResolver from "./sayHello.resolver";

const resolvers = {
  Query: {
    ...sayHelloResolver.Query,
  },
  Mutation: {
    ...sayHelloResolver.Mutation,
  },
};

export default resolvers;
