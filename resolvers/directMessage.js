/* eslint-disable operator-linebreak */
import { withFilter } from 'apollo-server';
import requiresAuth, { directMessageSubscription } from '../utils/permissions';
import pubsub from '../utils/pubsub';

const NEW_DIRECT_MESSAGE = 'NEW_DIRECT_MESSAGE';

export default {
  Subscription: {
    newDirectMessage: {
      subscribe: directMessageSubscription.createResolver(withFilter(
        () => pubsub.asyncIterator(NEW_DIRECT_MESSAGE),
        (payload, args, { user }) =>
          payload.teamId === args.teamId &&
            ((payload.senderId === user.id && payload.receiverId === args.userId) ||
              (payload.senderId === args.userId && payload.receiverId === user.id)),
      )),
    },
  },
  DirectMessage: {
    sender: ({ sender, senderId }, args, { models }) => {
      if (sender) {
        return sender;
      }

      return models.User.findOne({ where: { id: senderId } }, { raw: true });
    },
  },
  Query: {
    directMessages: requiresAuth.createResolver(
      async (parent, { teamId, otherId }, { models, user }) =>
        models.DirectMessage.findAll(
          {
            order: [['created_at', 'ASC']],
            where: {
              teamId,
              [models.Sequelize.Op.or]: [
                {
                  [models.Sequelize.Op.and]: [{ receiverId: otherId }, { senderId: user.id }],
                },
                {
                  [models.Sequelize.Op.and]: [{ receiverId: user.id }, { senderId: otherId }],
                },
              ],
            },
          },
          { raw: true },
        ),
    ),
  },
  Mutation: {
    createDirectMessage: requiresAuth.createResolver(async (parent, args, { models, user }) => {
      try {
        const directMessage = await models.DirectMessage.create({ ...args, senderId: user.id });
        pubsub.publish(NEW_DIRECT_MESSAGE, {
          teamId: args.teamId,
          senderId: user.id,
          receiverId: args.receiverId,
          newDirectMessage: {
            ...directMessage.dataValues,
            sender: {
              username: user.username,
            },
          },
        });
        return true;
      } catch (error) {
        // eslint-disable-next-line no-console
        console.log(error);
        return false;
      }
    }),
  },
};
