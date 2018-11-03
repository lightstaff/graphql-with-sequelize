module.exports = (sequelize, DataTypes) => {
  const EMail = sequelize.define(
    'email',
    {
      id: {
        type: DataTypes.INTEGER,
        primaryKey: true,
        autoIncrement: true,
      },
      address: DataTypes.STRING,
    },
    {
      timestamps: false,
      tableName: 'email',
    }
  );

  EMail.associate = models => {
    EMail.belongsTo(models.user);
  };

  return EMail;
};
