const path = require('path')
const User = require('../models/user')
const ForgotPasswordRequest = require('../models/forgotPasswordRequest')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const Sib = require('sib-api-v3-sdk')
const dotenv = require('dotenv')
dotenv.config();
const { v4: uuidv4 } = require('uuid')



exports.getSignupPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views/signup.html'))
}


exports.postVerifyEmail = async (req, res, next) => {
    try {
        const email = req.body.email
        console.log('Inside post verify user')

        const users = await User.findAll({ where: { email: email } })

        if (users.length) {
            res.status(200)
            res.json({ message: 'user found' })
        }
        else {
            res.json({ message: 'user not found' });

        }

    } catch (error) {

        console.log(error)

    }

}


exports.postSignupUser = async (req, res, next) => {

    try {
        const { name, email, password } = req.body;

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            const user = await User.create({
                name: name,
                email: email,
                password: hash
            })

            res.status(201).json({ message: 'Account created successfully' })
        })

    } catch (error) {

        res.json(error);
    }

}


exports.getLoginPage = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views/login.html'))
}


function generateAccessToken(id, name) {
    return jwt.sign({ userId: id, name: name }, 'Sourabh@8989')
}


exports.postVerifyLogin = async (req, res, next) => {

    try {
        console.log('inside postVerifyLogin')
        const { email, password } = req.body;
        const users = await User.findAll({ where: { email: email } })

        if (users.length == 0) {
            return res.json({ message: 'user not found' })
        }
        const user = users[0];

        bcrypt.compare(password, user.password, (err, match) => {
            console.log(match)
            if (!match) {
                res.status(400).json({ message: 'password is incorrect' })
            }
            else {
                return res.status(200).json({ message: 'login successful', token: generateAccessToken(user.id, user.name) })
            }

        })

    } catch (error) {

        console.log(error)

    }

}


exports.getUserExpense = (req, res, next) => {
    res.sendFile(path.join(__dirname, '../', 'views/index.html'))
}

exports.getIsPrimiumUser = (req, res, next) => {

    if (req.user.isPremiumMember == true) {
        res.status(200).json({ isPremium: true })
    }
    else {
        res.status(200).json({ isPremium: false })
    }

}

exports.postForgotPassword = async (req, res, next) => {

    try {

        const user = await User.findOne({ where: { email: req.body.email } })
        //create request details in ForgotPasswordRequest table

        const requestDetails = await ForgotPasswordRequest.create({
            id: uuidv4(),
            isActive: 1,
            userId: user.id
        })

        const userEmail = req.body.email;
        const client = Sib.ApiClient.instance;
        const apiKey = client.authentications['api-key'];
        apiKey.apiKey = process.env.API_KEY;

        const transacEmailApi = new Sib.TransactionalEmailsApi();
        const sender = {
            email: 'smpratik888@gmaail.com'
        };
        const reciever = [{
            email: `${userEmail}`
        }]

        const response = await transacEmailApi.sendTransacEmail({
            sender: sender,
            subject: 'password recover',
            to: reciever,
            textContent: `http://localhost:3000/user/password/reset-password?forgotPasswordRequestId=${requestDetails.id}`

        })


        res.status(200).json({ message: 'message send successfully' })

    } catch (error) {
        console.log(error)
    }

}


exports.getResetPasswordPage = async (req, res, next) => {

    try {
        const forgotPasswordRequestId = req.query.forgotPasswordRequestId;
        //check whether forgotPasswordRequestId is valid or not 

        const requestDetails = await ForgotPasswordRequest.findOne({ where: { id: forgotPasswordRequestId } })

        if (!requestDetails) {
            console.log('pppppppp')
            res.status(400).json({ message: 'bad request' })
        }
        if (requestDetails.isActive == true) {
            res.status(200).sendFile(path.join(__dirname, '../', 'views/reset-password.html'))
        }

        else {
            res.status(419).json({ message: 'link is expired' })
        }


    } catch (error) {
        console.log(error)
    }

}


exports.postResetPassword = async (req, res, next) => {
    try {
        const password = req.body.password;
        const forgotPasswordRequestId = req.body.forgotPasswordRequestId;

        // find corresponding request details to this forgotPasswordRequestId
        const requestDetails = await ForgotPasswordRequest.findOne({ where: { id: forgotPasswordRequestId } })

        //make the corresponding request as inactive
        await ForgotPasswordRequest.update({ isActive: false }, { where: { id: forgotPasswordRequestId } })

        const saltrounds = 10;
        bcrypt.hash(password, saltrounds, async (err, hash) => {
            const user = await User.update({
                password: hash
            }, { where: { id: requestDetails.userId } })


            res.status(201).json({ message: 'password reset successfully' })
        })
    } catch (error) {
        console.log(error)
    }
}

