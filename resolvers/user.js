import { tryLogin } from '../utils/auth';
import formatErrors from '../utils/formatErrors';
import requiresAuth from '../utils/permissions';

export default {
  User: {
    teams: (parent, args, { models, user }) =>
      models.sequelize.query('SELECT * FROM teams as team JOIN members as member on team.id = member.team_id WHERE member.user_id = ?',
        {
          replacements: [user.id],
          model: models.Team,
          raw: true,
        }),
  },
  Query: {
    me: requiresAuth.createResolver((parent, args, { models, user: { id } }) =>
      models.User.findOne({ where: { id } })),
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
