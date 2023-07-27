'use strict'
module.exports = (sequelize, DataTypes) => {
  const Product = sequelize.define('Product', {
    pharmacyId: {
      type: DataTypes.INTEGER,
      references: { model: 'Pharmacy', key: 'id' }
    },
    maskId: {
      type: DataTypes.INTEGER,
      references: { model: 'Mask', key: 'id' }
    },
    price: DataTypes.DECIMAL
  }, {})
  Product.associate = function (models) {
    // associations can be defined here
    Product.belongsToMany(models.User, {
      through: models.Purchase,
      foreignKey: 'ProductId',
      as: 'ProductBuyer'
    })
  }
  return Product
}
