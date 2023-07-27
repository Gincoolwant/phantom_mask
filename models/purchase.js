'use strict'
module.exports = (sequelize, DataTypes) => {
  const Purchase = sequelize.define('Purchase', {
    userId: {
      type: DataTypes.INTEGER,
      references: { model: 'User', key: 'id' }
    },
    productId: {
      type: DataTypes.INTEGER,
      references: { model: 'Product', key: 'id' }
    },
    transAmount: DataTypes.DECIMAL,
    transDate: DataTypes.DATE
  }, {})
  Purchase.associate = function (models) {
    // associations can be defined here
  }
  return Purchase
}
