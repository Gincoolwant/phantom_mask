'use strict'
module.exports = (sequelize, DataTypes) => {
  const Pharmacy = sequelize.define('Pharmacy', {
    name: DataTypes.STRING,
    cashBalance: DataTypes.DECIMAL
  }, { underscored: true })
  Pharmacy.associate = function (models) {
    // associations can be defined here
    Pharmacy.hasMany(models.Openinghour)
    Pharmacy.hasMany(models.Product, { foreignKey: 'PharmacyId' })
  }
  return Pharmacy
}
