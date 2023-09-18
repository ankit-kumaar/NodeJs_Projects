const express = require('express')
const app = express();

const sequelize = require('./util/database')
const bodyParser = require('body-parser')
const path = require('path')
const cors = require('cors')

const expenseRoutes = require('./routes/expense')
const userRoutes = require('./routes/user')
const purchaseRoutes = require('./routes/purchase')
const premiumRoutes = require('./routes/premium')

const User = require('./models/user')
const Expense = require('./models/expense')
const Order = require('./models/order')
const ForgotPasswordRequest = require('./models/forgotPasswordRequest')
const DownloadedExpenseReport = require('./models/downloadedExpenseReport')

const pageNotFoundMiddleware = require('./middlewares/404')


// app.use(
//     helmet({
//         contentSecurityPolicy: {
//             directives: {
//                 ...helmet.contentSecurityPolicy.getDefaultDirectives(),
//                 "script-src": ['self', 'unsafe-inline', 'data:',
//                     'http://localhost:3000',
//                     'https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha1/dist/js/bootstrap.bundle.min.js',
//                     'https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js',
//                     'https://checkout.razorpay.com/v1/checkout.js'],

//                 'frame-src': ['self', 'https://checkout.razorpay.com/v1/checkout.js']
//             },
//         },
//         crossOriginEmbedderPolicy: false,
//     })
// )

app.use(cors())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(bodyParser.json())

app.use(express.static(path.join(__dirname, 'public')))

app.use(userRoutes)
app.use(expenseRoutes)
app.use(purchaseRoutes)
app.use(premiumRoutes)
app.use(pageNotFoundMiddleware)

User.hasMany(Expense)
Expense.belongsTo(User)

User.hasMany(Order)
Order.belongsTo(User)

User.hasMany(ForgotPasswordRequest)
ForgotPasswordRequest.belongsTo(User)

User.hasMany(DownloadedExpenseReport)
DownloadedExpenseReport.belongsTo(User)

sequelize.sync({force:true})
    .then(() => {

        app.listen(process.env.PORT || 3306)
    }).catch((error) => {
        console.log(error)
    })

