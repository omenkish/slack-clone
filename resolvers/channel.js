import formatErrors from '../utils/formatErrors';
import requiresAuth from '../utils/permissions';

export default {
  Mutation: {
    createChannel: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const team = await models.Team.findOne({ where: { id: args.teamId } }, { raw: true });
        if (team.owner !== user.id) {
          return {
            ok: false,
            errors: [
              {
                path: 'name',
                message: 'Only the owner of the team can create a channel',
              },
            ],
          };
        }
        const channel = await models.Channel.create(args);
        return {
          ok: true,
          channel,
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
