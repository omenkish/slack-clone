import requiresAuth from '../utils/permissions';

export default {
  Message: {
    user: ({ userId }, args, { models }) => models.User.findOne(
      { where: { id: userId } }, { raw: true },
    ),
  },
  Query: {
    messages: requiresAuth.createResolver(async (parent, { channelId }, { models }) =>
      models.Message.findAll({ order: [['createdAt', 'ASC']], where: { channelId } }, { raw: true })),
  },
  Mutation: {
    createMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        await models.Message.create({ ...args, userId: user.id });
        return true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return false;
      }
    }),
  },
};
