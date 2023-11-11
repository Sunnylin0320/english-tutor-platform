'use strict'
const { Course, Booking } = require('../models')
const { faker } = require('@faker-js/faker')

module.exports = {
  async up (queryInterface, Sequelize) {
    const booking = await Booking.findAll({
      include: [{ model: Course, attributes: ['TutorId'] }],
      raw: true,
      nest: true
    })

    const bookingSlice = booking.slice(0, 4)

    await queryInterface.bulkInsert(
      'Comments',
      Array.from({ length: bookingSlice.length }, (_, item) => ({
        StudentId: bookingSlice[item].StudentId,
        BookingId: bookingSlice[item].id,
        TutorId: bookingSlice[item].Course.TutorId,
        content: faker.lorem.sentence({ min: 5, max: 15 }),
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    )
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', {})
  }
}
