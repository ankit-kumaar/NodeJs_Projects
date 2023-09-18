//setting header common to all requests
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')
axios.defaults.headers.common['rowsPerPage'] = localStorage.getItem('token')


let expenseTable = document.getElementById('expense-table')

// adding an event listener on dom content loaded ,check user is premium or not 
window.addEventListener('DOMContentLoaded', checkUserIsPremiumOrNot)

async function checkUserIsPremiumOrNot() {
    try {

        const response1 = await axios.get('http://localhost:3000/user/is_premium')
        if (response1.data.isPremium == true) {
            document.getElementById('buy-premium-link').style.display = 'none';
            document.getElementById('leaderboard-link').style.display = 'block';
            document.getElementById('premium-user').style.display = "block";
            document.getElementById('expense-report').style.display = "block";

        }

    } catch (error) {
        console.log(error)
        console.log(error.response.data.message)
        //if user is not logged in redirect to home page
        if (error.response.data.message == 'you are not currently logged in') {
            window.location = '/'
            window.alert('You are not currently logged in')
        }
        if (error.response.data.message == 'authentication error') {
            window.location = '/'
            window.alert('Authentication Error.Please try logging in again.')
        }
    }

}


//get all expense details from server and show them on user screen 
//adding event handler to  DOMContentLoaded

window.addEventListener('DOMContentLoaded', getExpensesFromServer)

async function getExpensesFromServer() {

    try {
        console.log('entered into getAllExpensesFromServer function')
        //send request for getting 1st 10 expenses
        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 1;
        const rowsPerPage = localStorage.getItem('rows-per-page')
        const response = await axios.get(`http://localhost:3000/expenses?page=${page}&rowsPerPage=${rowsPerPage}`)

        //show expenses and pagination 
        showExpenses(response.data.expenses)
        await showPagination(response.data);

    } catch (error) {
        console.log(error)

    }

}

async function showPagination(object) {

    document.getElementById('pagination-btns').innerHTML = '';

    //add previous page button if it exists
    if (object.hasPreviousPage) {
        const previousPageBtn = document.createElement('button')
        previousPageBtn.innerText = `${object.previousPage}`;
        previousPageBtn.addEventListener('click', () => { getExpenses(object.previousPage) })
        document.getElementById('pagination-btns').appendChild(previousPageBtn)

    }

    //add current page button
    const currentPageBtn = document.createElement('button')
    currentPageBtn.innerText = `${object.currentPage}`;
    currentPageBtn.classList.add('active')
    currentPageBtn.addEventListener('click', () => { getExpenses(object.currentPage) })
    document.getElementById('pagination-btns').appendChild(currentPageBtn)


    //add next page button if it exists
    if (object.hasNextPage) {
        const nextPageBtn = document.createElement('button')
        nextPageBtn.innerText = `${object.nextPage}`;
        nextPageBtn.addEventListener('click', () => { getExpenses(object.nextPage) })
        document.getElementById('pagination-btns').appendChild(nextPageBtn)

    }

    //add last page button 
    if(object.lastPage>object.nextPage){
        const lastPageBtn = document.createElement('button')
        lastPageBtn.innerText = `${object.lastPage}`;
        lastPageBtn.addEventListener('click', () => { getExpenses(object.lastPage) })
        document.getElementById('pagination-btns').insertAdjacentHTML('beforeend','....')
        document.getElementById('pagination-btns').appendChild(lastPageBtn)

    }

}


async function getExpenses(page) {

    const rowsPerPage = localStorage.getItem('rows-per-page')
    const response = await axios.get(`http://localhost:3000/expenses?page=${page}&rowsPerPage=${rowsPerPage}`)
    showExpenses(response.data.expenses)
    await showPagination(response.data);
}


function showExpenses(expenses) {

    document.getElementById('expense-table-body').innerHTML = ''
    expenses.forEach((element) => {

        let expenseDetailsHTML =
            `<tr id=${element.id}> 
        <td>${element.amount}</td> 
        <td>${element.description}</td>
        <td>${element.date}</td>
        <td>${element.category}</td> 
        <td><button class='edit-btn'>Edit</button>
        <button class='delete-btn'>Delete</button></td>
        </tr>`

        document.getElementById('expense-table-body').insertAdjacentHTML('beforeend', expenseDetailsHTML)

    })
}



//adding delete functionality
expenseTable.addEventListener('click', deleteExpense)

async function deleteExpense(e) {

    try {
        if (e.target.classList.contains('delete-btn')) {
            const response = window.confirm('Do you want delete expense?')
            if (response) {

                let id = e.target.parentNode.parentNode.id;
                const response = await axios.post(`http://localhost:3000/delete-expense`, { id: id })

                // delete target element from screen also
                e.target.parentNode.parentNode.remove();

            }
        }

    } catch (error) {
        console.log(error)
    }

}

//add edit functionality
expenseTable.addEventListener('click', autoFillEditExpenseForm)

async function autoFillEditExpenseForm(e) {
    try {

        if (e.target.classList.contains('edit-btn')) {

            console.log('inside edit expense function')
            let id = e.target.parentNode.parentNode.id;

            const editExpenseModal = document.getElementById('edit-expense-modal')

            editExpenseModal.style.display = 'block';

            const response = await axios.get(`http://localhost:3000/expense-details/${id}`)
            console.log(response.data)

            document.getElementById('edit-expense-id').value = response.data.id
            document.getElementById('edit-expense-amount').value = response.data.amount;
            document.getElementById('edit-expense-description').value = response.data.description
            document.getElementById('edit-expense-category').value = response.data.category

        }
    } catch (error) {
        console.log(error)
    }

}

//adding event listener to edit expense button

const editExpenseForm = document.getElementById('edit-expense-form')

editExpenseForm.addEventListener('submit', editExpense)

async function editExpense(e) {
    try {
        e.preventDefault();

        const expenseDetails = {
            id: document.getElementById('edit-expense-id').value,
            amount: document.getElementById('edit-expense-amount').value,
            description: document.getElementById('edit-expense-description').value,
            category: document.getElementById('edit-expense-category').value
        }

        const response1 = await axios.post(`http://localhost:3000/edit-expense`, expenseDetails)
        const updatedExpenseDetails = response1.data;

        console.log(response1)
        //edit corresponding expense item from screen too
        const expenseTableBodyElements = document.getElementById('expense-table-body').children

        Array.from(expenseTableBodyElements).forEach((element) => {
            if (element.id == response1.data.id) {
                element.innerHTML = `<td>${updatedExpenseDetails.amount}</td> 
                <td>${updatedExpenseDetails.description}</td>
                <td>${updatedExpenseDetails.date}</td>
                <td>${updatedExpenseDetails.category}</td> 
                <td><button class='edit-btn'>Edit</button>
                <button class='delete-btn'>Delete</button></td>`
            }
        })

        closeModal();

    } catch (error) {
        console.log(error)
    }

}

// Get the modal

let editExpenseModal = document.getElementById("edit-expense-modal");


// Get the <span> element that closes the modal
let closeButton = document.getElementsByClassName("close");


// When the user clicks on close button (x), close the modal
Array.from(closeButton).forEach((element) => {
    element.addEventListener('click', closeModal)

})


function closeModal() {
    editExpenseModal.style.display = "none";

}


// When the user clicks anywhere outside of the modal, close it

window.addEventListener('click', modalDisplayOff)

function modalDisplayOff(e) {
    if (e.target.classList.contains('Modal')) {
        e.target.style.display = 'none'
    }
}


//adding an event listener to no of rows form submit button

document.getElementById('no-of-rows-form').addEventListener('submit', async (e) => {

    try {
        e.preventDefault();
        //store key in local storage for no of rows 
        localStorage.setItem('rows-per-page', document.getElementById('no-of-rows').value)

        const urlParams = new URLSearchParams(window.location.search);
        const page = urlParams.get('page') || 1;
        const rowsPerPage = localStorage.getItem('rows-per-page')

        const response = await axios.get(`http://localhost:3000/expenses?page=${page}&rowsPerPage=${rowsPerPage}`)

        //show expenses in the table
        //show pagination

        showExpenses(response.data.expenses)
        await showPagination(response.data);

    } catch (error) {
        console.log(error)
    }

})