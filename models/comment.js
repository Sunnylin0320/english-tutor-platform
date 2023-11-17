'use strict'
const { Model } = require('sequelize')
module.exports = (sequelize, DataTypes) => {
  class Comment extends Model {
    static associate (models) {
      Comment.belongsTo(models.User, {
        foreignKey: 'TutorId',
        as: 'TutorComments'
      })
      Comment.belongsTo(models.User, {
        foreignKey: 'StudentId',
        as: 'StudentComments'
      })
      Comment.belongsTo(models.Booking, { foreignKey: 'BookingId' })
    }
  }
  Comment.init(
    {
      TutorId: DataTypes.INTEGER,
      StudentId: DataTypes.INTEGER,
      BookingId: DataTypes.INTEGER,
      content: DataTypes.TEXT,
      score: DataTypes.FLOAT
    },
    {
      sequelize,
      modelName: 'Comment',
      tableName: 'Comments'
    }
  )
  return Comment
}
