'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Booking extends Model {
    static associate (models) {
      Booking.belongsTo(models.Course, { foreignKey: 'CourseId' })
      Booking.belongsTo(models.User, { foreignKey: 'StudentId' })
      Booking.hasOne(models.Comment, { foreignKey: 'BookingId' })
    }
  }
  Booking.init(
    {
      StudentId: DataTypes.INTEGER,
      CourseId: DataTypes.INTEGER,
      period: DataTypes.STRING,
      classTime: DataTypes.DATE
    },
    {
      sequelize,
      modelName: 'Booking',
      tableName: 'Bookings'
    }
  )
  return Booking
}
