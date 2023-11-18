'use strict'

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const students = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'student' LIMIT 5;",
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const pastCourses = await queryInterface.sequelize.query(
      'SELECT id, startTime, endTime, spendTime FROM Courses WHERE endTime < NOW() LIMIT 10;',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const futureCourses = await queryInterface.sequelize.query(
      'SELECT id, startTime, endTime, spendTime FROM Courses WHERE endTime > NOW() LIMIT 10;',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const bookingsData = []

    futureCourses.forEach(course => {
      students.forEach(student => {
        const startDate = new Date(course.startTime)
        startDate.setHours(0, 0, 0)
        const endDate = new Date(course.endTime)
        endDate.setHours(0, 0, 0)
        const daysInBetween = (endDate - startDate) / (24 * 60 * 60 * 1000)
        const randomDay = Math.floor(Math.random() * (daysInBetween + 1))
        startDate.setDate(startDate.getDate() + randomDay)

        const possibleTimes = ['18:00', '19:00', '20:00']
        const randomTime =
          possibleTimes[Math.floor(Math.random() * possibleTimes.length)]

        const bookingData = {
          StudentId: student.id,
          CourseId: course.id, // 使用正确的 course.id
          period: `${startDate.toISOString().substring(0, 10)} ${randomTime}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        bookingsData.push(bookingData)
      })
    })

    students.forEach(student => {
      pastCourses.forEach(course => {
        const startDate = new Date(course.startTime)
        startDate.setHours(0, 0, 0)
        const endDate = new Date(course.endTime)
        endDate.setHours(0, 0, 0)
        const daysInBetween = (endDate - startDate) / (24 * 60 * 60 * 1000)
        const randomDay = Math.floor(Math.random() * (daysInBetween + 1))
        startDate.setDate(startDate.getDate() + randomDay)

        const possibleTimes = ['18:00', '19:00', '20:00']
        const randomTime =
          possibleTimes[Math.floor(Math.random() * possibleTimes.length)]

        const bookingData = {
          StudentId: student.id,
          CourseId: course.id, // 使用正确的 course.id
          period: `${startDate.toISOString().substring(0, 10)} ${randomTime}`,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        bookingsData.push(bookingData)
      })
    })

    await queryInterface.bulkInsert('Bookings', bookingsData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bookings', {})
  }
}
