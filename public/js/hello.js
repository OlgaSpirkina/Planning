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
// Delete class from Planning page
const modalParts = [
  ['div', 'div', 'div', 'div', 'h5', 'button', 'div', 'p', 'div', 'button'],
  [
    {
      "class": "modal fade",
      "tabindex": "-1",
      "role": "dialog",
      "id": "myModal",
      "aria-labelledby": "myModalLabel",
      "aria-hidden": "true"
    },
    {
      "class": "modal-dialog",
      "role": "document"
    },
    {
      "class": "modal-content"
    },
    {
      "class": "modal-header"
    },
    {
      "class": "modal-title"
    },
    {
      "type": "button",
      "class": "close",
      "data-dismiss": "modal",
      "aria-label": "Close"
    },
    {
      "class": "modal-body"
    },
    {},
    {
      "class": "modal-footer"
    },
    {
      "type": "button",
      "class": "btn btn-primary"
    }
  ],
  [ null, null, null, null,
    "Supprimer le créneau", "fermer", null,
    "Voulez-vous supprimer le créneau?", null, null]
];
const createModal = (index) => {
  let arrToCreate = []
  modalParts.forEach((item) => {
    item.forEach((elem, indexElem) => {
      if(indexElem === index){
        arrToCreate.push(elem);
      }
    })
  })
  let createElem = document.createElement(arrToCreate[0]);
  for(const key in arrToCreate[1]){
    createElem.setAttribute(key, arrToCreate[1][key]);
  }
  if(arrToCreate[2] !== null){
    let textInside = document.createTextNode(arrToCreate[2]);
    createElem.appendChild(textInside);
  }
  return createElem
}
const theModal = createModal(0);
const modalDialog = createModal(1);
const modalContent = createModal(2);
const modalHeader = createModal(3);
const theTitle = createModal(4);
const firstButton = createModal(5);
const modalBody = createModal(6);
const pInBody = createModal(7);
const modalFooter = createModal(8);
const secondButton = createModal(9);
modalHeader.appendChild(theTitle);
modalHeader.appendChild(firstButton);
modalBody.appendChild(pInBody);
modalFooter.appendChild(secondButton);
modalContent.appendChild(modalHeader);
modalContent.appendChild(modalBody);
modalContent.appendChild(modalFooter);
modalDialog.appendChild(modalContent);
theModal.appendChild(modalDialog);
//
const btnDeleteClass = document.querySelectorAll('.btn-delete-class');
const divDeleteClassInfo = document.querySelectorAll('.delete-class-info');
for(let i=0; i<btnDeleteClass.length; i++){
  btnDeleteClass[i].addEventListener('click', function(){
    for(let j=0; j<divDeleteClassInfo.length; j++){
      if(i === j){
        const theTextInModal = document.createTextNode(`
          ${divDeleteClassInfo[i].children[0].innerHTML} chez ${divDeleteClassInfo[i].children[2].innerHTML}
          de ${divDeleteClassInfo[i].children[3].innerHTML} heures fait par ${divDeleteClassInfo[i].children[1].innerHTML}
        `);
        pInBody.appendChild(theTextInModal);
        const theAnchor = document.createElement('a');
        theAnchor.setAttribute('href', `/deleteclass/${btnDeleteClass[i].value}`);
        const deleteText = document.createTextNode('Supprimer');
        theAnchor.appendChild(deleteText);
        secondButton.appendChild(theAnchor);
        document.querySelector('body').appendChild(theModal);
      }
    }
  })
}
})
