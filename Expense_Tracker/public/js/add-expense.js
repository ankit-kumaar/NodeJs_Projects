//setting header common to all requests
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')


// adding event listener on form submit
const addExpenseForm = document.getElementById('add-expense-form')
addExpenseForm.addEventListener('submit', addExpense)


//function to add expense details 
//saving the expense details to database and showing it on screen too 

async function addExpense(e) {

    try {
        e.preventDefault();
        //get all input elements 

        let expenseAmount = document.getElementById('expense-amount')
        let expenseDescription = document.getElementById('expense-description')
        let expenseCategory = document.getElementById('expense-category')

        //getting todays date
        const today = new Date();
        const yyyy = today.getFullYear();
        let mm = today.getMonth() + 1; // Months start at 0!
        let dd = today.getDate();
        if (dd < 10) {
            dd = '0' + dd;
        }
        if (mm < 10) {
            mm = '0' + mm;
        }
        const formattedToday = dd + '/' + mm + '/' + yyyy;

        let expenseDate = formattedToday;

        //crate object of expense details entered by the user
        let expenseDetails = {
            amount: `${expenseAmount.value}`,
            description: `${expenseDescription.value}`,
            date: expenseDate,
            category: `${expenseCategory.value}`
        }

        console.log('inside add expense function')
        
        const response = await axios.post(`http://localhost:3000/add-expense-details`, expenseDetails)

        //showing succcess message on form
        document.getElementById('form-submit-message').textContent = 'Expense added successfully...'
        setTimeout(() => {
            document.getElementById('form-submit-message').textContent = ""
        }, 3000)

        // make all the input values to default 

        document.getElementById('expense-amount').value = ""
        document.getElementById('expense-description').value = ""
        document.getElementById('expense-category').value = ""

    } catch (error) {
        console.log(error)
        console.log(error.response.message)
    }

}

// adding an event listener on dom content loaded 
window.addEventListener('DOMContentLoaded',checkUserIsPremiumOrNot)

async function checkUserIsPremiumOrNot(){
    try{

        const response1 = await axios.get('http://localhost:3000/user/is_premium')
        if (response1.data.isPremium == true) {
            document.getElementById('buy-premium-link').style.display='none';
            document.getElementById('leaderboard-link').style.display='block';
            document.getElementById('premium-user').style.display = "block";
            document.getElementById('expense-report').style.display = "block";
    
        }
        
    }catch(error){
        console.log(error)
        console.log(error.response.data.message)
        //if user is not logged in redirect to home page
        if(error.response.data.message=='you are not currently logged in')
        {
            window.location='/'
            window.alert('You are not currently logged in')
        }
        if(error.response.data.message=='authentication error')
        {
            window.location='/'
            window.alert('Authentication Error.Please try logging in again.')
        }
    }
   
}