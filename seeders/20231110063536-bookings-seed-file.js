'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const students = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'student' LIMIT 3;",
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const courses = await queryInterface.sequelize.query(
      'SELECT id FROM Courses WHERE endTime < NOW() LIMIT 10;',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const bookingsData = []
    students.forEach(student => {
      for (let i = 0; i < 10; i++) {
        const bookingData = {
          StudentId: student.id,
          CourseId: courses[i].id,
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
