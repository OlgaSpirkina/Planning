window.addEventListener('load', function () {
  let formatedDay = document.querySelectorAll('.formated-day');
  for(let i=0; i<formatedDay.length; i++){
    let formatIt = new Date(formatedDay[i].innerHTML).toLocaleDateString('fr-fr', { weekday:"long", year:"numeric", month:"short", day:"numeric"})
    formatedDay[i].innerHTML = formatIt
  }
  let today = new Date();
  let currentMonth = today.getMonth();
  let currentYear = today.getFullYear();
  let selectYear = document.getElementById("years");
  let selectMonth = document.getElementById("months");
  let monthAndYear = document.getElementById("monthAndYear");
})
