'use strict'
module.exports = (sequelize, DataTypes) => {
  const Openinghour = sequelize.define('Openinghour', {
    pharmacyId: {
      type: DataTypes.INTEGER
    },
    dayOfWeek: DataTypes.INTEGER,
    open: DataTypes.TIME,
    close: DataTypes.TIME
  }, { underscored: true })
  Openinghour.associate = function (models) {
    // associations can be defined here
    Openinghour.belongsTo(models.Pharmacy)
  }
  return Openinghour
}
