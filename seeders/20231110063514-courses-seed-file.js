'use strict'
const { TUTOR_AMOUNT, getAvailableTime, getMinuteDuration } = require('../helpers/seeder-helpers')
const { randomAvaiDay } = require('../helpers/dayjs-helpers')
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tutors = await queryInterface.sequelize.query(
      "SELECT id FROM Users WHERE role = 'tutor';",
      {
        type: Sequelize.QueryTypes.SELECT
      }
    )

    await queryInterface.bulkInsert(
      'Courses',
      Array.from({ length: TUTOR_AMOUNT }, (_, i) => ({
        TutorId: tutors[i].id,
        name: faker.lorem.sentence(),
        startTime: getAvailableTime(i).toString(),
        spendTime: getMinuteDuration(),
        bookingDay: randomAvaiDay(),
        link: faker.internet.url(),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Courses', {})
  }
}
