'use strict'
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    // 從資料庫找到所有導師
    const tutors = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'tutor';",
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    const coursesData = []
    const pastFrom = '2023-01-01'
    const pastTo = '2023-10-31'
    const newFrom = '2023-11-20'
    const newTo = '2023-12-03'
    const courseCount = 5 // 要生成的每個類別的課程數量

    for (const tutor of tutors) {
      const generateCourseData = (start, end) => {
        const startTime = new Date(
          faker.date.between({ from: start, to: end })
        )
        const endTime = new Date(
          faker.date.between({ from: startTime, to: end })
        ) // 確保EndTime在StartTime之後
        return {
          TutorId: tutor.id,
          name: faker.lorem.sentence(),
          startTime,
          endTime,
          spendTime: '30 minutes',
          bookingDay: new Date(faker.date.between({ from: startTime, to: endTime })),
          link: faker.internet.url(),
          createdAt: new Date(),
          updatedAt: new Date()
        }
      }

      // 生成過去的課程
      for (let i = 0; i < courseCount; i++) {
        const pastCourseData = generateCourseData(pastFrom, pastTo)
        coursesData.push(pastCourseData)
      }

      // 生成未來的課程
      for (let i = 0; i < courseCount; i++) {
        const newCourseData = generateCourseData(newFrom, newTo)
        coursesData.push(newCourseData)
      }
    }

    await queryInterface.bulkInsert('Courses', coursesData, {})
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', {})
  }
}
