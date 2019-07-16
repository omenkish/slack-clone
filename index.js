/* eslint-disable import/prefer-default-export */
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import path from 'path';
import { fileLoader, mergeTypes, mergeResolvers } from 'merge-graphql-schemas';

import models from './models';

const typeDefs = mergeTypes(fileLoader(path.join(__dirname, './schema')));
const resolvers = mergeResolvers(fileLoader(path.join(__dirname, './resolvers')));

const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
  context: request => ({
    ...request,
    models,
    user: {
      id: 'a139ba98-430c-4e03-9e98-71e1b166e9dd',
    },
  }),
});
const app = express();
server.applyMiddleware({ app }); // app is from an existing express app

models.sequelize.sync().then(() => {
  // eslint-disable-next-line no-console
  app.listen({ port: 8080 }, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));
});
