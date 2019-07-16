export default {
  Mutation: {
    createTeam: async (parent, args, { models, user }) => {
      try {
        return await models.Team.create({ ...args, owner: user.id });
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return false;
      }
    },
  },
};
