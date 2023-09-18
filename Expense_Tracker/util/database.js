const dotenv = require('dotenv')
dotenv.config();

const Sequelize=require('sequelize')

const sequelize=new Sequelize(process.env.DB_NAME, process.env.DB_USER, process.env.DB_PWD,{
    dialect:process.env.DB,host:process.env.DB_HOST,
    
})
module.exports=sequelize;