const Sequelize=require('sequelize')
const sequelize=require('../util/database')

const DownloadedExpenseReport=sequelize.define('downloadedExpenseReport',{
    id:{
        type:Sequelize.INTEGER,
        allowNull:false,
        primaryKey:true,
        autoIncrement:true
    },
    fileURL:{
        type:Sequelize.STRING,
        allowNull:false
    },
    date:{
        type:Sequelize.STRING,
        allowNull:false
    },
    userId:{
        type:Sequelize.INTEGER,
        allowNull:false
    }

})

module.exports=DownloadedExpenseReport;