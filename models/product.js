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
    // Product.belongsToMany(models.User, {
    //   through: models.Purchase,
    //   foreignKey: 'ProductId',
    //   as: 'ProductBuyer'
    // })
    Product.hasMany(models.Purchase, { foreignKey: 'ProductId' })
  }
  return Product
}
