'use strict'
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    pharmacyId: {
      type: DataTypes.INTEGER
    },
    maskId: {
      type: DataTypes.INTEGER
    },
    price: DataTypes.DECIMAL
  }, { underscored: true })
  Product.associate = function (models) {
    // associations can be defined here
    Product.belongsTo(models.Pharmacy, { foreignKey: 'PharmacyId' })
    Product.belongsTo(models.Mask, { foreignKey: 'MaskId' })
    Product.hasMany(models.Purchase, { foreignKey: 'ProductId' })
  }
  return Product
}
