'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const students = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'student' LIMIT 3;",
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const pastCourses = await queryInterface.sequelize.query(
      'SELECT id, bookingDay FROM Courses WHERE endTime < NOW() LIMIT 10;',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const futureCourses = await queryInterface.sequelize.query(
      'SELECT id, bookingDay FROM Courses WHERE endTime > NOW() LIMIT 2;',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const bookingsData = []

    // 過去的預定紀錄
    students.forEach(student => {
      for (let i = 0; i < 10; i++) {
        const bookingData = {
          StudentId: student.id,
          CourseId: pastCourses[i].id,
          period: '30 minutes',
          createdAt: pastCourses[i].bookingDay,
          updatedAt: new Date()
        }
        bookingsData.push(bookingData)
      }
    })

    // 未來的預定紀錄
    students.forEach(student => {
      for (let i = 0; i < 2; i++) {
        const bookingData = {
          StudentId: student.id,
          CourseId: futureCourses[i].id,
          period: '30 minutes',
          createdAt: new Date(),
          updatedAt: new Date()
        }
        bookingsData.push(bookingData)
      }
    })

    await queryInterface.bulkInsert('Bookings', bookingsData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bookings', {})
  }
}
