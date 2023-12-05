'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')
const { STUDENT_AMOUNT, TUTOR_AMOUNT } = require('../helpers/seeder-helpers')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert('Users', [
      {
        name: 'root',
        email: 'root@example.com',
        password: bcrypt.hashSync('12345678', 10),
        introduction: faker.string.alphanumeric({
          length: { min: 1, max: 160 }
        }),
        teachingStyle: faker.string.alphanumeric({
          length: { min: 1, max: 160 }
        }),
        avatar: faker.image.avatar(),
        nation: faker.location.country(),
        role: 'admin',
        createdAt: new Date(),
        updatedAt: new Date()
      },
      ...Array.from({ length: STUDENT_AMOUNT }, (_, i) => ({
        name: `user${i + 1}`,
        email: `user${i + 1}@example.com`,
        password: bcrypt.hashSync('12345678', 10),
        introduction: faker.string.alphanumeric({
          length: { min: 1, max: 160 }
        }),
        teachingStyle: faker.string.alphanumeric({
          length: { min: 1, max: 160 }
        }),
        avatar: faker.image.avatar(),
        nation: faker.location.country(),
        role: 'student',
        createdAt: new Date(),
        updatedAt: new Date()
      })),
      ...Array.from({ length: TUTOR_AMOUNT }, (_, i) => ({
        name: `user${i + 6}`,
        email: `user${i + 6}@example.com`,
        password: bcrypt.hashSync('12345678', 10),
        introduction: faker.string.alphanumeric({
          length: { min: 1, max: 160 }
        }),
        teachingStyle: '以生動活潑的教學風格而聞名。',
        avatar: faker.image.avatar(),
        nation: faker.location.country(),
        role: 'tutor',
        createdAt: new Date(),
        updatedAt: new Date()
      }))
    ])
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
