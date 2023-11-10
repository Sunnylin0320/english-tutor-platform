'use strict'
const bcrypt = require('bcryptjs')
const { faker } = require('@faker-js/faker')

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert(
      'Users',
      [
        {
          name: 'root',
          email: 'root@example.com',
          password: await bcrypt.hash('12345678', 10),
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
        {
          name: 'user1',
          email: 'user1@example.com',
          password: await bcrypt.hash('12345678', 10),
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
        },
        {
          name: 'user2',
          email: 'user2@example.com',
          password: await bcrypt.hash('12345678', 10),
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
        },
        {
          name: 'user3',
          email: 'user3@example.com',
          password: await bcrypt.hash('12345678', 10),
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
        },
        {
          name: 'user4',
          email: 'user4@example.com',
          password: await bcrypt.hash('12345678', 10),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          teachingStyle: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          avatar: faker.image.avatar(),
          nation: faker.location.country(),
          role: 'tutor',
          createdAt: new Date(),
          updatedAt: new Date()
        },
        {
          name: 'user5',
          email: 'user5@example.com',
          password: await bcrypt.hash('12345678', 10),
          introduction: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          teachingStyle: faker.string.alphanumeric({
            length: { min: 1, max: 160 }
          }),
          avatar: faker.image.avatar(),
          nation: faker.location.country(),
          role: 'tutor',
          createdAt: new Date(),
          updatedAt: new Date()
        }
      ],
      {}
    )
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Users', null, {})
  }
}
