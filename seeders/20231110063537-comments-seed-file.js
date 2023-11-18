'use strict'
const { Booking, Course } = require('../models')
const { faker } = require('@faker-js/faker')

module.exports = {
  async up (queryInterface, Sequelize) {
    const selectedBookings = await Booking.findAll({
      limit: 20,
      include: [{ model: Course, attributes: ['TutorId'] }],
      raw: true,
      nest: true
    })

    const tutorBookings = {}
    selectedBookings.forEach(booking => {
      const tutorId = booking.Course.TutorId
      if (!tutorBookings[tutorId]) {
        tutorBookings[tutorId] = []
      }
      if (tutorBookings[tutorId].length < 2) {
        tutorBookings[tutorId].push(booking)
      }
    })

    const commentsData = []
    Object.keys(tutorBookings).forEach(tutorId => {
      tutorBookings[tutorId].forEach(booking => {
        const commentData = {
          StudentId: booking.StudentId,
          BookingId: booking.id,
          TutorId: tutorId,
          content: faker.lorem.sentence({ min: 5, max: 15 }),
          score: (Math.floor(Math.random() * 5) + Math.random()).toFixed(1),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        commentsData.push(commentData)
      })
    })

    await queryInterface.bulkInsert('Comments', commentsData, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', {})
  }
}
