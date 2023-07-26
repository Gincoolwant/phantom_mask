'use strict';
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    cashBalance: DataTypes.DECIMAL
  }, {});
  User.associate = function(models) {
    // associations can be defined here
    User.belongsToMany(models.Product, {
      through: models.Purchase,
      foreignKey: 'UserId',
      as: 'MaskBuyer'
    })
  };
  return User;
};