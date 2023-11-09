'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Course extends Model {
    static associate (models) {
      // 定義 Course 和 Comment 之間的一對多關聯
      Course.hasMany(models.Comment, { foreignKey: 'courseId' })
      // 定義 Course 和 User 之間的多對一關聯
      Course.belongsTo(models.User, { foreignKey: 'studentId' })
      Course.belongsTo(models.User, { foreignKey: 'tutorId' })
    }
  }
  Course.init(
    {
      studentId: DataTypes.INTEGER,
      tutorId: DataTypes.INTEGER,
      name: DataTypes.STRING,
      startTime: DataTypes.DATE,
      endTime: DataTypes.DATE,
      spendTime: DataTypes.STRING,
      bookingDay: DataTypes.DATE,
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
