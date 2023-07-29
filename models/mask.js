'use strict'
module.exports = (sequelize, DataTypes) => {
  const Mask = sequelize.define('Mask', {
    name: DataTypes.STRING,
    color: DataTypes.STRING,
    unitPerPack: DataTypes.INTEGER
  }, {
    underscored: true
  })
  Mask.associate = function (models) {
    // associations can be defined here
    Mask.belongsToMany(models.Pharmacy, {
      through: models.Product,
      foreignKey: 'MaskId',
      as: 'sellingSpot'
    })
  }
  return Mask
}
