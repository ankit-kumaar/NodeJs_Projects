const logoutBtn=document.getElementById('logout-btn')

logoutBtn.addEventListener('click',logout)

function logout(){
    localStorage.clear();
    sessionStorage.clear();
    window.location='http://localhost:3000/'
}