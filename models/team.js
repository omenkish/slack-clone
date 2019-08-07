export default (sequelize, DataTypes) => {
  const Team = sequelize.define('team', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING,
      unique: true,
      validate: {
        len: {
          args: [3, 25],
          msg: 'Team name must be 3 to 25 characters long',
        },
      },
    },
  });

  Team.associate = (models) => {
    Team.belongsToMany(models.User, {
      through: models.Member,
      foreignKey: 'teamId',
    });
  };

  return Team;
};
