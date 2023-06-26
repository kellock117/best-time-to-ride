const helloResolver = {
  Query: {
    say: async (_, {}) => {
      return "hello";
    },
  },
  Mutation: {
    sayH: async (_, {}) => {
      return "hhhhhhhh";
    },
  },
};

export default helloResolver;
