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
      'SELECT id, endTime FROM Courses WHERE endTime < NOW() LIMIT 10;',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const futureCourses = await queryInterface.sequelize.query(
      'SELECT id, endTime FROM Courses WHERE endTime > NOW() LIMIT 10;',
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const bookingsData = []

    students.forEach(student => {
      for (let i = 0; i < 10; i++) {
        const bookingData = {
          StudentId: student.id,
          CourseId: pastCourses[i].id,
          period: pastCourses[i].spendTime,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        bookingsData.push(bookingData)
      }
    })

    const selectedStudents = []
    while (selectedStudents.length < 5) {
      const randomStudent =
        students[Math.floor(Math.random() * students.length)]
      if (!selectedStudents.includes(randomStudent)) {
        selectedStudents.push(randomStudent)
      }
    }

    const selectedCourses = []
    while (selectedCourses.length < 10) {
      const randomCourse =
        futureCourses[Math.floor(Math.random() * futureCourses.length)]
      if (!selectedCourses.includes(randomCourse)) {
        selectedCourses.push(randomCourse)
      }
    }

    selectedStudents.forEach(student => {
      let coursesToBook = 2
      const studentId = student.id

      while (coursesToBook > 0) {
        const randomCourse = selectedCourses.pop()
        if (!randomCourse) {
          break
        }

        const bookingData = {
          StudentId: studentId,
          CourseId: randomCourse.id,
          period: randomCourse.spendTime,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        bookingsData.push(bookingData)

        coursesToBook--
      }
    })

    if (selectedStudents.length < 2) {
      const randomStudent =
        students[Math.floor(Math.random() * students.length)]
      const randomCourse = selectedCourses.pop()

      if (randomStudent && randomCourse) {
        const bookingData = {
          StudentId: randomStudent.id,
          CourseId: randomCourse.id,
          period: randomCourse.spendTime,
          createdAt: new Date(),
          updatedAt: new Date()
        }
        bookingsData.push(bookingData)
      }
    }

    await queryInterface.bulkInsert('Bookings', bookingsData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Bookings', {})
  }
}
