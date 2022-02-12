window.addEventListener('load', function () {
  const time = document.getElementById('time');
  const date = document.getElementById('date');
  const everyClass = document.querySelectorAll('.every-class');
  const totalClasses = document.getElementById('total_classes');
  let countClasses = 0;
  date.addEventListener('change', function(){
    if(date.value !== undefined){
      time.value = date.value + " " + "HH:MM";
      document.getElementById('label-time').innerHTML = "Remplacez HH par heure et MM par minutes";
    }
  });
  time.addEventListener('change', function(){
    time.value = time.value + ":00";
    document.getElementById('label-time').innerHTML = "Heurs du début des cours:";
  });

  for(let i=0; i<everyClass.length; i++){
    everyClass[i].addEventListener('focusout', e => {
      if(everyClass[i].value === ''){
        everyClass[i].value = 0;
      }
        countClasses += parseInt(everyClass[i].value, 10);
        totalClasses.value = countClasses;
    })

  }
})
