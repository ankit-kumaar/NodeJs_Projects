//setting header common to all requests
axios.defaults.headers.common['Authorization'] = localStorage.getItem('token')

// adding an event listener on DOMcontent loaded 
window.addEventListener('DOMContentLoaded',checkUserIsPremiumOrNot)

async function checkUserIsPremiumOrNot(){
    try{

        const response1 = await axios.get('http://localhost:3000/user/is_premium')
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


//adding an event listener to download report button
const downloadReportBtn=document.getElementById('download-report-btn')

downloadReportBtn.addEventListener('click',downloadExpenseReport)

async function downloadExpenseReport(){
    try{
        const response=await axios.get('http://localhost:3000/premium/download-expense-report')

        const a=document.createElement('a')
        a.href=response.data.fileURL;
        a.download='expense-report.csv'
        a.click()

        //save the details into expense report download history table

        const expenseReportFileDetails=`<tr> <td> <a href="${response.data.fileURL}">${response.data.fileURL}</a></td> <td> ${response.data.date} </td> </tr>`


        document.getElementById('expense-report-download-history-table-body').insertAdjacentHTML("afterbegin",expenseReportFileDetails)

        
    }catch(error){

        console.log(error)
    }
}


// adding an event listener on dom content loaded ,check user is premium or not
window.addEventListener('DOMContentLoaded',checkUserIsPremiumOrNot)

async function checkUserIsPremiumOrNot(){
    try{

        const response1 = await axios.get('http://localhost:3000/user/is_premium')
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



window.addEventListener('DOMContentLoaded',showDownloadHistory)

async function showDownloadHistory(){
try{

    const response=await axios.get('http://localhost:3000/premium/show-expense-report-download-history')

    const downloadHistory=Array.from(response.data);

    console.log(response.data)
    downloadHistory.forEach((expenseReportFile)=>{

        const expenseReportFileDetails=`<tr> <td> <a href="${expenseReportFile.fileURL}">${expenseReportFile.fileURL}</a></td> <td> ${expenseReportFile.date} </td> </tr>`

        document.getElementById('expense-report-download-history-table-body').insertAdjacentHTML('afterBegin',expenseReportFileDetails)


    })


}catch(error){
    console.log(error)
}
}
