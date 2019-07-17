import bcrypt from 'bcrypt';

export default {
  Query: {
    getUser: (parent, { id }, { models }) => models.User.findOne({ where: { id } }),
    allUsers: (parent, args, { models }) => models.User.findAll(),
  },
  Mutation: {
    register: async (parent, { password, ...otherArgs }, { models }) => {
      try {
        const hashedPassword = await bcrypt.hash(password, 10);
        await models.User.create({ ...otherArgs, password: hashedPassword });
        return true;
      } catch (error) {
        return false;
      }
    },
  },

};
