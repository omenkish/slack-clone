import { ApolloServer } from 'apollo-server';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';
import models from './models';
import { getUser } from './utils/auth';

const SECRET = 'thisiswhywearehere';
const SECRET2 = 'thisiswhywearehereiuhjbnklkjiuhbj';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));
const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
  context: async ({ req, res }) => {
    const token = req.headers['x-token'] || '';
    const refreshToken = req.headers['x-refresh-token'] || '';
    const user = await getUser(token, refreshToken, SECRET, SECRET2, models, res);
    return {
      ...req,
      models,
      user,
      SECRET,
      SECRET2,
    };
  },
});

models.sequelize.sync().then(() => {
  server.listen({ port: 8080 }).then(({ url }) => {
    // eslint-disable-next-line no-console
    console.log(`🚀  Server ready at ${url}`);
  });
});
