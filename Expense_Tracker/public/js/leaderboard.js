//setting header common to all requests
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

// adding an event listener on dom content loaded ,check user is premium or not
window.addEventListener('DOMContentLoaded',checkUserIsPremiumOrNot)

async function checkUserIsPremiumOrNot(){
    try{

        const response1 = await axios.get('http://localhost:3000/user/is_premium')
        console.log('inside check user is premium or not')
        if (response1.data.isPremium == true) {
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



// adding an eventlistener on domcontentloaded, show the leaderboard

window.addEventListener("DOMContentLoaded", showLeaderboard)

async function showLeaderboard() {
    try {
        
        const leaderboard_table = document.getElementById('leaderboard-table')

        const response = await axios.get('http://localhost:3000/premium/show_leaderboard')

        console.log(response)
        let rank = 1
        response.data.forEach((user) => {

            let userDetails = `<tr>
        <td>${rank}</td>
        <td>${user.name}</td>
        <td>${user.totalExpense}</td>
        </tr>`

            //increment the rank
            rank++;
            console.log(userDetails)
            document.getElementById('leaderboard-table-body').insertAdjacentHTML('beforeend', userDetails)

        })
    } catch (error) {
        console.log(error)
    }


}
