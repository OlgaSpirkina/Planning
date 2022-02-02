window.addEventListener('load', function () {
  const months = [
    'Janvier',
    'Février',
    'Mars',
    'Avril',
    'Mai',
    'Juin',
    'Juillet',
    'Août',
    'Septembre',
    'Octobre',
    'Novembre',
    'Décembre'
  ];
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
  // Previous and Next Months btns
  const currentMonthInPlanning = document.getElementById('current-month'),
  previousMonth = document.getElementById('previous-month'),
  nextMonth = document.getElementById('next-month');
  let findCurrentMonth = currentMonthInPlanning.innerHTML;
  let findPréviousIndex = 0;
  let findNextIndex = 0;
  for(let i=0; i<months.length; i++){
    if(findCurrentMonth === months[i]){
      if(i === 0){
        findPréviousIndex = 11;
        previousMonth.href = `/plannings/${months[findPréviousIndex]}`;
        previousMonth.innerHTML = months[findPréviousIndex];
      }else{
        findPréviousIndex = i-1;
        previousMonth.href = `/plannings/${months[findPréviousIndex]}`;
        previousMonth.innerHTML = months[findPréviousIndex];
      }
      if(i === 11){
        findNextIndex = 0;
        nextMonth.href = `/plannings/${months[findNextIndex]}`;
        nextMonth.innerHTML = months[findNextIndex];
      }else{
        findNextIndex = i+1;
        nextMonth.href = `/plannings/${months[findNextIndex]}`;
        nextMonth.innerHTML = months[findNextIndex];
      }

    }
  }
})
