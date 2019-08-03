import formatErrors from '../utils/formatErrors';
import requiresAuth from '../utils/permissions';

export default {
  Query: {
    allTeams: requiresAuth.createResolver(async (parent, args, { models, user }) =>
      models.Team.findAll({ where: { owner: user.id } }, { raw: true })),
    inviteTeams: requiresAuth.createResolver(async (parent, args, { models, user }) =>
      models.sequelize.query('SELECT * FROM teams JOIN members on teams.id = members.team_id WHERE user_id = ?', {
        replacements: [user.id],
        model: models.Team,
      })),
  },
  Mutation: {
    addTeamMember: requiresAuth.createResolver(async (
      parent, { email, teamId }, { models, user }) => {
      try {
        const teamPromise = models.Team.findOne({ where: { id: teamId } }, { raw: true });
        const userToAddPromise = models.User.findOne({ where: { email } }, { raw: true });

        const [team, userToAdd] = await Promise.all([teamPromise, userToAddPromise]);
        if (team.owner !== user.id) {
          return {
            ok: false,
            errors: [{
              path: 'email',
              message: 'You cannot add members to the team',
            }],
          };
        }

        if (!userToAdd) {
          return {
            ok: false,
            errors: [{
              path: 'email',
              message: 'Couldn\'t find user with this email',
            }],
          };
        }

        await models.Member.create({ userId: userToAdd.id, teamId });
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
    createTeam: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const response = await models.sequelize.transaction(async () => {
          const team = await models.Team.create({ ...args, owner: user.id });
          await models.Channel.create({ name: 'general', public: true, teamId: team.id });
          return team;
        });
        return {
          ok: true,
          team: response,
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

  Team: {
    channels: ({ id }, args, { models }) => models.Channel.findAll({ where: { teamId: id } }),
  },
};
