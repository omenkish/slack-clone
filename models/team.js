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
    },
  });

  Team.associate = (models) => {
    Team.belongsToMany(models.User, {
      through: 'member',
      foreignKey: 'teamId',
    });
    Team.belongsTo(models.User, {
      foreignKey: 'owner',
    });
  };

  return Team;
};
