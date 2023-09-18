const path=require('path')
const { json } = require('body-parser');
const Razorpay = require('razorpay')
const sequelize=require('../util/database')
const Order = require('../models/order');
const User = require('../models/user');
const dotenv = require('dotenv')
dotenv.config();

exports.getPremiumMembership = async (req, res, next) => {

    try {
        console.log('entered into getPremiumMembership controller')
        console.log(process.env.RAZORPAY_KEY_ID)
        let rzp = new Razorpay({
            key_id: process.env.RAZORPAY_KEY_ID,
            key_secret: process.env.RAZORPAY_KEY_SECRET
        })
        console.log(rzp.key_secret)
        const amount = 2500;

        rzp.orders.create({ amount: amount, currency: 'INR' }, (err, order) => {

            if (err) {
                console.log('error occured while creating an orderid')
                throw new Error(JSON.stringify(err))
            }

            req.user.createOrder({ orderId: order.id, status: 'PENDING' })
                .then(() => {
                    res.status(201).json({ order, key_id: rzp.key_id })
                })

        })


    } catch (error) {
        res.status(403).json({ message: 'something went wrong', error: error })

    }
}

exports.postUpdateTransactionStatus = async (req, res, next) => {

    //initiate transaction 
    const t=await sequelize.transaction();

    try {
        const { order_id, payment_id, status, isPremiumMember } = req.body;

        const order = await Order.findOne({ where: { orderId: order_id } })

        const promise1 = order.update({ paymentId: payment_id, status: status },{transaction:t});
        const promise2 = req.user.update({ isPremiumMember: isPremiumMember },{transaction:t});

        const response = await Promise.all([promise1, promise2])
        await t.commit();
        if (status == 'SUCCESSFUL') {
            res.status(200).json({ message: 'transaction successful' })
        }
        else {
            res.status(200).json({ message: 'transaction unsuccessful' })
        }


    } catch (error) {
        await t.rollback();
        console.log(error)
        res.status(500).json({message:'failed to update transaction status'})

    }
}


exports.getBuyPremiumMembershipPage=(req,res,next)=>{
    res.status(200).sendFile(path.join(__dirname,'../','views/buy-premium.html'))
}