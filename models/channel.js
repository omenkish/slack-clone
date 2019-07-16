export default (sequelize, DataTypes) => {
  const Channel = sequelize.define('channel', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    name: DataTypes.STRING,
    public: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  });

  Channel.associate = (models) => {
    // 1:M
    Channel.belongsTo(models.Team, {
      foreignKey: 'teamId',
    });

    Channel.belongsToMany(models.User, {
      through: 'channel_member',
      foreignKey: 'channelId',
    });
  };

  return Channel;
};
