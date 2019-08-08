export default (sequelize, DataTypes) => {
  const DirectMessage = sequelize.define('direct_message', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    text: DataTypes.STRING,
  });

  DirectMessage.associate = (models) => {
    // 1:M
    DirectMessage.belongsTo(models.Team, {
      foreignKey: 'teamId',
    });
    DirectMessage.belongsTo(models.User, {
      foreignKey: 'senderId',
    });
    DirectMessage.belongsTo(models.User, {
      foreignKey: 'receiverId',
    });
  };

  return DirectMessage;
};
