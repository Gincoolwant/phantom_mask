'use strict'
module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    userId: {
      type: DataTypes.INTEGER
    },
    productId: {
      type: DataTypes.INTEGER
    },
    transAmount: DataTypes.DECIMAL,
    transDate: DataTypes.DATE
  }, { underscored: true })
  Purchase.associate = function (models) {
    // associations can be defined here
    Purchase.belongsTo(models.User, { foreignKey: 'UserId' })
    Purchase.belongsTo(models.Product, { foreignKey: 'ProductId' })
  }
  return Purchase
}
