import bcrypt from 'bcrypt';

export default (sequelize, DataTypes) => {
  const User = sequelize.define('user', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    username: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        isAlphanumeric: {
          args: true,
          msg: 'Username can only contain numbers and letters',
        },
        len: {
          args: [3, 25],
          msg: 'Username must be 3 to 25 characters long',
        },
      },
    },
    email: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
      validate: {
        isEmail: {
          args: true,
          msg: 'Invalid email format',
        },
      },
    },
    password: {
      type: DataTypes.STRING,
      allowNull: false,
      validate: {
        len: {
          args: [5, 100],
          msg: 'The password must be between 5 and 100 characters long',
        },
      },
    },
  },
  {
    hooks: {
      afterValidate: async (user) => {
        const hashedPassword = await bcrypt.hash(user.password, 12);
        // eslint-disable-next-line no-param-reassign
        user.password = hashedPassword;
      },
    },
  });

  User.associate = (models) => {
    User.belongsToMany(models.Team, {
      through: 'member',
      foreignKey: 'userId',
    });

    User.belongsToMany(models.Channel, {
      through: 'channel_member',
      foreignKey: 'userId',
    });
  };
  return User;
};
