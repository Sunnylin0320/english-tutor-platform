'use strict'
module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Comments', 'score', {
      type: Sequelize.FLOAT
    })
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Comments', 'score')
  }
}
