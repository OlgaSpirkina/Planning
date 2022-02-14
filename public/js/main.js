window.addEventListener('load', function () {
  const username = document.getElementById('username');
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
    anchorInCreatPlanning.setAttribute('href', `/trainersplanning/${trainer}`);
  });
// Delete trainer from the db trainers use modal
  const deleteTrainerBtn = document.querySelectorAll('.delete-trainer');
  const trainerInfoTr = document.querySelectorAll('.trainer-info');
  const createModal = (elem, attributes, text) => {
    const theElem = document.createElement(elem);
    for(let i=0; i<attributes.length; i++){
      for(const key in attributes[i]){
        theElem.setAttribute(key, attributes[i][key]);
      }
    }
    if(text){
      const textNode = document.createTextNode(text);
      theElem.appendChild(textNode)
    }
    return theElem
  }
  const myModal = createModal('div', [{"class":"modal fade"}, {"id":"myModal"}, {"tabindex": "-1"}, {"role": "dialog"}, {"aria-labelledby": "myModalLabel"}, {"aria-hidden": "true"}], null);
  const modalDialog = createModal('div', [{"class": "modal-dialog"}, {"role": "document"}], null);
  const modalContent = createModal('div', [{"class": "modal-content"}], null);
  const modalHeader = createModal('div', [{"class": "modal-header"}], null);
  const modalTitle = createModal('h5', [{"class": "modal-title"}, {"id": "exampleModalLabel"}], "Voulez-vous supprimer la fiche de professeur?");
  const closeBtn = createModal('button', [{"type": "button"}, {"class": "close"}, {"data-dismiss": "modal"}, {"aria-label": "Close"}], "Annuler");
  const modalBody = createModal('div', [{"class": "modal-body"}], null);
  const modalFooter = createModal('div', [{"class": "modal-footer"}], null);
  //const deleteBtn = createModal('button', [{"type":"button"}, {"data-dismiss": "modal"}, {"id": "delete-trainer"}], null);
  modalHeader.appendChild(modalTitle);
  modalHeader.appendChild(closeBtn);
  //modalFooter.appendChild(deleteBtn);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modalDialog.appendChild(modalContent);
  myModal.appendChild(modalDialog);
  document.querySelector('body').appendChild(myModal);
  for(let i=0; i<deleteTrainerBtn.length; i++){
    deleteTrainerBtn[i].addEventListener('click', function(){
      for(let j=0; j<trainerInfoTr.length; j++){
        if(i === j){
          const textInModalBody = document.createTextNode(
          `
          l'entraineur ${trainerInfoTr[j].children[0].innerText} ${trainerInfoTr[j].children[1].innerText} ?
          `);
          modalBody.appendChild(textInModalBody);
          const anchor = createModal('a', [{"type":"button"}, {"href":`/deletetrainerdata/${deleteTrainerBtn[i].value}`}], "supprimer");
          modalFooter.appendChild(anchor);
        }
      }
    })
  }

})
