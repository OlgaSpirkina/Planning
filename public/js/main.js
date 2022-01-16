window.addEventListener('load', function () {
  const username = document.getElementById('username');
  const clearForm = document.querySelectorAll('.clear-form');
  const theForm = document.querySelectorAll('form');
  let variableForUsername = '';
  let createUsername = document.querySelectorAll('.create-username');
  for(let i=0; i<createUsername.length; i++){
    createUsername[i].addEventListener('change', function(evt){
      variableForUsername += this.value;
      username.value = variableForUsername;
    })
      variableForUsername = '';
  }
  const anchorInCreatPlanning = document.getElementById('anchor-in-createplanning');
  let createPlanning = document.getElementById('create-planning');
  const chooseTrainer = document.getElementById('choose-trainer');
  chooseTrainer.addEventListener("change", function() {
    //var options = chooseTrainer.querySelectorAll("option");
    let trainer = chooseTrainer.options[chooseTrainer.selectedIndex].value;
    trainer = trainer.replace(/\s/g, '');
    anchorInCreatPlanning.setAttribute('href', `/trainersplanning/${trainer}`)
  });
  for(let i=0; i<clearForm.length; i++){
    clearForm[i].addEventListener('click', function(){
      theForm.reset();
      return false;
    })
  }

})
