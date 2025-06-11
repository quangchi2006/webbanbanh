var nav = document.querySelector('nav');

document.addEventListener("scroll", () => {
    if (window.scrollY > 300) {
      nav.classList.add("nav-fiexd-top");
    } else {
      nav.classList.remove("nav-fiexd-top");
    }

});

var bar = document.querySelector('.bar');
console.log(nav);
var lagNav = true;
bar.addEventListener("click", () => {
  nav.classList.toggle('activeBar');
})




var backHead = document.querySelector(".back_head")
document.addEventListener("scroll", () => {
  if (window.scrollY > 300) {
    backHead.style.transform = "translateY(-100px)";
  } else if (window.scrollY <= 300) {
    backHead.style.transform = "translateY(50px)";
  }
});

// active nav 

const listLinkNavItem = document.querySelectorAll(".menu li a");
console.log(listLinkNavItem);
listLinkNavItem.forEach((navLinkItem) => {
  var cunrentURL = window.location.href;
  var hrefValue = navLinkItem.href;
  console.log(cunrentURL);
  console.log(hrefValue);
  if (cunrentURL === hrefValue) {
    var parent = navLinkItem.parentNode;
    parent.classList.add("nav__item--active");
  } else {
    var parent = navLinkItem.parentNode;
    parent.classList.remove("nav__item--active");
  }
});