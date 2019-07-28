import formatErrors from '../utils/formatErrors';
import requiresAuth from '../utils/permissions';

export default {
  Mutation: {
    createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        await models.Team.create({ ...args, owner: user.id });
        return {
          ok: true,
        };
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return {
          ok: false,
          errors: formatErrors(error, models),
        };
      }
    }),
  },
};
