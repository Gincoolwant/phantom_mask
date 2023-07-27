'use strict'
module.exports = (sequelize, DataTypes) => {
  const Pharmacy = sequelize.define('Pharmacy', {
    name: DataTypes.STRING,
    cashBalance: DataTypes.DECIMAL
  }, {})
  Pharmacy.associate = function (models) {
    // associations can be defined here
    Pharmacy.hasMany(models.OpeningHour)
    Pharmacy.belongsToMany(models.Mask, {
      through: models.Product,
      foreignKey: 'PharmacyId',
      as: 'MaskTypeInPharmacy'
    })
  }
  return Pharmacy
}
