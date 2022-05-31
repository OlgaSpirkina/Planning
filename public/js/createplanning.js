window.addEventListener('load', function () {
  const everyClass = document.querySelectorAll('.every-class');
  const totalClasses = document.getElementById('total_classes');
  let countClasses = 0;
  let prevVal = 0;
  for(let i=0; i<everyClass.length; i++){
    if(everyClass[i].value === '')everyClass[i].value = 0;
    /*
    countClasses += parseInt(everyClass[i].value, 10);
    everyClass[i].addEventListener('keydown', function (event) {
      prevVal = parseInt(everyClass[i].value, 10);
      if (event.keyCode === 8) {
        countClasses -= prevVal;
        prevVal = 0;
      }
      if (event.keyCode === 46) {
        console.log(prevVal)
        countClasses -= prevVal;
        prevVal = 0;
      }
      if(everyClass[i].value !== ''){
        countClasses += parseInt(everyClass[i].value, 10);
      }
      totalClasses.value = countClasses;
    });
    */
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
