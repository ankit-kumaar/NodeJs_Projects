const express=require('express')
const router=express.Router();
const purchaseController=require('../controllers/purchase')
const userAuthentication=require('../middlewares/auth')

router.get('/purchase/buy-premium-membership-page',purchaseController.getBuyPremiumMembershipPage)

router.get('/purchase/premium_membership',userAuthentication.authenticate,purchaseController.getPremiumMembership)

router.post('/purchase/update_transaction_status',userAuthentication.authenticate,purchaseController.postUpdateTransactionStatus)

module.exports=router;