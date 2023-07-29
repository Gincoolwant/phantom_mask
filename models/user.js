'use strict'
module.exports = (sequelize, DataTypes) => {
  const User = sequelize.define('User', {
    name: DataTypes.STRING,
    cashBalance: DataTypes.DECIMAL
  }, { underscored: true })
  User.associate = function (models) {
    // User.belongsToMany(models.Product, {
    //   through: models.Purchase,
    //   foreignKey: 'UserId',
    //   as: 'MaskBuyer'
    // })
    User.hasMany(models.Purchase, { foreignKey: 'UserId' })
  }
  return User
}
