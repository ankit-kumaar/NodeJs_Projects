const Sequelize = require('sequelize')
const sequelize = require('../util/database')

const User = sequelize.define('user', {

    id: {
        type: Sequelize.INTEGER,
        allowNull: false,
        autoIncrement: true,
        primaryKey: true
    },

    name: {
        type: Sequelize.STRING
    },

    email: {
        type: Sequelize.STRING,
        unique: true
    },

    password: {
        type: Sequelize.STRING
    },
    isPremiumMember: {
        type: Sequelize.BOOLEAN
    },
    totalExpense: {
        type: Sequelize.INTEGER,
        defaultValue:0
        
    }


})

module.exports = User;