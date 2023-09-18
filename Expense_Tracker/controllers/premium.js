const User = require('../models/user')
const Expense = require('../models/expense')
const DownloadedExpenseReport=require('../models/downloadedExpenseReport')
const path = require('path')
const sequelize = require('../util/database')
const dotenv=require('dotenv')
dotenv.config();
const AWS=require('aws-sdk')

const S3Services=require('../services/S3-services')

exports.getShowLeaderboard = async (req, res, next) => {
    try {

        const leaderboardOfUsers = await User.findAll({

            attributes: ['name','totalExpense'],

            order: [['totalExpense', 'DESC']]

        })

        res.status(200).json(leaderboardOfUsers)

    } catch (error) {
        console.log(error)
        res.status(500).json({success:false,error:error})

    }
}


exports.getLeaderboardPage = (req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../', 'views/leaderboard.html'))
}

exports.getExpenseReportPage=(req, res, next) => {
    res.status(200).sendFile(path.join(__dirname, '../', 'views/expense-report.html'))
}


exports.getDownloadExpenseReport=async (req,res,next)=>{

    try{
        const user=req.user;
        const expenses=await req.user.getExpenses();

        const strigifiedExpenses=JSON.stringify(expenses)
        const fileName=`expense-report/${req.user.id}/${new Date()}.txt`
        const fileURL=await S3Services.uploadToS3(strigifiedExpenses,fileName)
       
        const response=await DownloadedExpenseReport.create({
            fileURL:fileURL,
            date: new Date().toLocaleString(),
            userId:req.user.id
        })

        res.status(200).json({fileURL:response.fileURL,date:response.date,success:true})


    }catch(error){

        console.log(error)
        res.status(500).json({fileURL:'',success:false, error:error})
    }

}

exports.getShowExpenseReportDownloadHistory=async (req,res,next)=>{

    try{
        const downloadHistory=await DownloadedExpenseReport.findAll({where:{userId:req.user.id}})
        res.status(200).json(downloadHistory)

    }catch(error){

        console.log(error)
        res.status(500).json({success:false,error:error})
    }
}