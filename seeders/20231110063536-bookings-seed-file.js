'use strict'
const { TUTOR_PER_NEWBOOKING, BOOKING_PER_STUDENT, STUDENT_AMOUNT, TUTOR_AMOUNT, getAvailableTime } = require('../helpers/seeder-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const students = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'student' LIMIT 5;",
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const courses = await queryInterface.sequelize.query(
      'SELECT id, spendTime FROM Courses;',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    // 每個使用者有至少 4 個 Lesson History 可以打分
    await queryInterface.bulkInsert('Bookings', [
      ...Array.from(
        { length: STUDENT_AMOUNT * BOOKING_PER_STUDENT },
        (_, i) => ({
          StudentId: students[Math.floor(i / BOOKING_PER_STUDENT)].id,
          CourseId: courses[i % courses.length].id,
          period: courses[i % courses.length].spendTime,
          classTime: getAvailableTime(i, 1),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      ),
      // 每個老師有至少 2 個 New Lesson
      ...Array.from(
        { length: TUTOR_PER_NEWBOOKING * TUTOR_AMOUNT },
        (_, i) => ({
          StudentId: students[Math.floor(Math.random() * STUDENT_AMOUNT)].id,
          CourseId: courses[Math.floor(i / TUTOR_PER_NEWBOOKING)].id,
          period: courses[Math.floor(i / TUTOR_PER_NEWBOOKING)].spendTime,
          classTime: getAvailableTime(i),
          createdAt: new Date(),
          updatedAt: new Date()
        })
      )
    ])
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bookings', {})
  }
}
