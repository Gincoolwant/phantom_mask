'use strict';
module.exports = (sequelize, DataTypes) => {
  const OpeningHour = sequelize.define('OpeningHour', {
    pharmacyId: {
      type: DataTypes.INTEGER,
      references: { model: 'Pharmacy', key: 'id' }
    },
    dayOfWeek: DataTypes.INTEGER,
    open: DataTypes.TIME,
    close: DataTypes.TIME
  }, {});
  OpeningHour.associate = function(models) {
    // associations can be defined here
    OpeningHour.belongsTo(models.Pharmacy)
  };
  return OpeningHour;
};