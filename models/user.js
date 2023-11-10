'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static associate (models) {
      // 定義 User 和 Course 之間的一對多關聯
      User.hasMany(models.Course, { foreignKey: 'TutorId' })
      // 定義 User 和 Comment 之間的一對多關聯
      User.hasMany(models.Comment, { foreignKey: 'StudentId', as: 'StudentComments' })
      User.hasMany(models.Comment, { foreignKey: 'TutorId', as: 'TutorComments' })
      // 定義 User 和 Booking 之間的一對多關聯
      User.hasMany(models.Booking, { foreignKey: 'StudentId' })
    }
  }
  User.init(
    {
      name: DataTypes.STRING,
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      introduction: DataTypes.TEXT,
      teachingStyle: DataTypes.TEXT,
      avatar: DataTypes.STRING,
      nation: DataTypes.STRING,
      role: DataTypes.STRING
    },
    {
      sequelize,
      modelName: 'User',
      tableName: 'Users'
    }
  )
  return User
}
