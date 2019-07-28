import { tryLogin } from '../utils/auth';
import formatErrors from '../utils/formatErrors';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    login: (parent, { email, password }, context) =>
      // eslint-disable-next-line implicit-arrow-linebreak
      tryLogin(email, password, context),
    register: async (parent, args, { models }) => {
      try {
        const user = await models.User.create(args);
        return {
          ok: true,
          user,
        };
      } catch (error) {
        return {
          ok: false,
          errors: formatErrors(error, models),

        };
      }
    },
  },

};
