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

    const futureCourses1 = await queryInterface.sequelize.query(
      'SELECT c.id, c.bookingDay FROM Courses c WHERE c.endTime > NOW() AND c.TutorId = (SELECT u.id FROM Users u WHERE u.role = "tutor" LIMIT 1);',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const futureCourses2 = await queryInterface.sequelize.query(
      'SELECT c.id, c.bookingDay FROM Courses c WHERE c.endTime > NOW() AND c.TutorId = (SELECT u.id FROM Users u WHERE u.role = "tutor" LIMIT 1 OFFSET 1);',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const bookingsData = []

    // 過去課程的預定紀錄
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

    // 未來課程的預定紀錄
    students.forEach((student, index) => {
      const course = futureCourses1[0]
      const bookingData = {
        StudentId: student.id,
        CourseId: course.id,
        period: '60 minutes',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      bookingsData.push(bookingData)
    })

    students.forEach((student, index) => {
      const course = futureCourses2[0]
      const bookingData = {
        StudentId: student.id,
        CourseId: course.id,
        period: '60 minutes',
        createdAt: new Date(),
        updatedAt: new Date()
      }
      bookingsData.push(bookingData)
    })

    await queryInterface.bulkInsert('Bookings', bookingsData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bookings', {})
  }
}
