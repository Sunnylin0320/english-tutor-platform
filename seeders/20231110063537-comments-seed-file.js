'use strict'
const { Booking, Course } = require('../models')
const { faker } = require('@faker-js/faker')

module.exports = {
  async up (queryInterface, Sequelize) {
    const pastBookings = await Booking.findAll({
      where: { period: { [Sequelize.Op.lt]: Sequelize.literal('NOW()') } },
      include: [{ model: Course, attributes: ['TutorId'] }],
      raw: true,
      nest: true
    })

    const tutorBookings = {}
    pastBookings.forEach(booking => {
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
          score: (Math.random() * 5).toFixed(2),
          createdAt: new Date(),
          updatedAt: new Date()
        }
        commentsData.push(commentData)
      })
    })

    while (commentsData.length < 20) {
      const randomBooking =
        pastBookings[Math.floor(Math.random() * pastBookings.length)]
      const commentData = {
        StudentId: randomBooking.StudentId,
        BookingId: randomBooking.id,
        TutorId: randomBooking.Course.TutorId,
        content: faker.lorem.sentence({ min: 5, max: 15 }),
        score: (Math.random() * 5).toFixed(1),
        createdAt: new Date(),
        updatedAt: new Date()
      }
      commentsData.push(commentData)
    }

    await queryInterface.bulkInsert('Comments', commentsData, {})
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.bulkDelete('Comments', {})
  }
}
