const express=require('express')

const router=express.Router();
const expenseController=require('../controllers/expense')
const userAuthentication=require('../middlewares/auth')

router.get('/',expenseController.getHomePage)

router.post('/add-expense-details', userAuthentication.authenticate, expenseController.postAddExpenseDetails)

router.get('/expenses', userAuthentication.authenticate, expenseController.getExpenses)

router.get('/expense-details/:id',userAuthentication.authenticate,expenseController.getExpenseDetails)

router.post('/delete-expense',userAuthentication.authenticate,expenseController.postDeleteExpense)

router.post('/edit-expense',userAuthentication.authenticate,expenseController.postEditExpense)

router.get('/add-expense',expenseController.getAddExpensePage)

router.get('/expense-table',expenseController.getExpenseTable)

module.exports=router;