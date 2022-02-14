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
  // Alert appears when submit new planning
  document.getElementById('submit-new-class').addEventListener('click', function(){
      (document.getElementById('add-planning').innerHTML ="Créez des nouveaux horaires")
        ?
      (document.getElementById('add-planning').innerHTML = "Les horaires ont été ajoutées. Consultez l'onglet Planning ou rajoutez de nouveaux horaires.")
        :
      (document.getElementById('add-planning').innerHTML ="Créez des nouveaux horaires");
  })
  // Redirect to the pre-filled page for each trainer
  const anchorInCreatPlanning = document.getElementById('anchor-in-createplanning');
  let createPlanning = document.getElementById('create-planning');
  const chooseTrainer = document.getElementById('choose-trainer');
  chooseTrainer.addEventListener("change", function() {
    let trainer = chooseTrainer.options[chooseTrainer.selectedIndex].value;
    trainer = trainer.replace(/\s/g, '');
    anchorInCreatPlanning.setAttribute('href', `/trainersplanning/${trainer}`);
  });
})
