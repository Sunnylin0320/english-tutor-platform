'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate (models) {
      Course.belongsTo(models.User, { foreignKey: 'TutorId' })
      Course.hasMany(models.Booking, { foreignKey: 'CourseId' })
    }
  }
  Course.init(
    {
      TutorId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      spendTime: DataTypes.STRING,
      bookingDay: DataTypes.STRING,
      link: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'Course',
      tableName: 'Courses'
    }
  )
  return Course
}
