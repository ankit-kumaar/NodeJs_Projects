
const header=document.querySelector('.header')
let headerTop = header.offsetTop;


function stickyHeader() {
    if (window.pageYOffset>= navbarTop) {    
      header.classList.add('sticky');
    } else {
      header.classList.remove('sticky');    
    }
  }
  
window.addEventListener('scroll', stickyHeader);



const navbar=document.querySelector('.navbar')
let navbarTop = navbar.offsetTop;

function stickyNavbar() {
  if (window.pageYOffset>= navbarTop) {    
    navbar.classList.add('sticky');
  } else {
    navbar.classList.remove('sticky');    
  }
}

window.addEventListener('scroll', stickyNavbar);
