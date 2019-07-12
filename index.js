/* eslint-disable import/prefer-default-export */
import express from 'express';
import { ApolloServer } from 'apollo-server-express';
import typeDefs from './schema';
import resolvers from './resolvers';
import models from './models';

const server = new ApolloServer({
  // These will be defined for both new or existing servers
  typeDefs,
  resolvers,
});
const app = express();
server.applyMiddleware({ app }); // app is from an existing express app

models.sequelize.sync({ force: true }).then(() => {
  // eslint-disable-next-line no-console
  app.listen({ port: 8080 }, () => console.log(`Server ready at http://localhost:4000${server.graphqlPath}`));
});
