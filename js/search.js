// search 
var search = document.querySelector(".search_icon");
var input = document.querySelector(".search_input");
console.log(search);
search.addEventListener("click", () => {
  input.classList.toggle('input_active');
});