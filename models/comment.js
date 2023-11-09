'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate (models) {
      // 定義 Comment 和 Course 之間的多對一關聯
      Comment.belongsTo(models.Course, { foreignKey: 'courseId' })
      // 定義 Comment 和 User 之間的多對一關聯，表示評論是哪位學生發表的
      Comment.belongsTo(models.User, { foreignKey: 'studentId' })
    }
  }
  Comment.init(
    {
      studentId: DataTypes.INTEGER,
      courseId: DataTypes.INTEGER,
      content: DataTypes.TEXT
    },
    {
      sequelize,
      modelName: 'Comment',
      tableName: 'Comments'
    }
  )
  return Comment
}
