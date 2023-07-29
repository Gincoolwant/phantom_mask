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
    Mask.hasMany(models.Product, { foreignKey: 'MaskId' })
  }
  return Mask
}
