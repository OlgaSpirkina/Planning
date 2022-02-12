window.addEventListener('load', function () {
  const putRequest = document.querySelectorAll('.create-put-request');
  const tableRowToUpdate = document.querySelectorAll('.table-row-to-update');
// function creating input & label of form to update the company
  const createInput = (name, text, value) => {
    const paragraph = document.createElement('p');
    const label = document.createElement('label');
    const labelText = document.createTextNode(text);
    const input = document.createElement('input');
    label.setAttribute('for', `${name}put`);
    label.appendChild(labelText);
    input.setAttribute('type', 'text');
    input.setAttribute('id', `${name}put`);
    input.setAttribute('name', `${name}put`);
    input.setAttribute('value', `${value}`)
    paragraph.appendChild(label);
    paragraph.appendChild(input);
    return paragraph;
  }
  for(let i=0; i<putRequest.length; i++){
    putRequest[i].addEventListener('click', function(){
      for(let j=0; j<tableRowToUpdate.length; j++){
        if(i === j){
          const inputValueArr = []
          for(let y=0; y<tableRowToUpdate[j].children.length; y++){
            inputValueArr.push(tableRowToUpdate[j].children[y].firstChild.innerHTML);
          }
          const form = document.createElement('form');
          form.setAttribute('method', 'POST');
          form.setAttribute('id', 'update-the-company');
          const fieldset = document.createElement('fieldset');
          const legend = document.createElement('legend');
          const legendText = document.createTextNode(`Modifier l\'entreprise ${inputValueArr[0]}`);
          const iconClose = document.createElement('div');
          iconClose.setAttribute('id', 'close-update-form');
          iconClose.innerHTML = '&times;';
          const company = createInput('company', 'Nom d\'entreprise:', inputValueArr[0]);
          const company_adress = createInput('company_adress', 'Adress', inputValueArr[1]);
          const contact_name = createInput('contact_name', 'Nom de responsable:', inputValueArr[2]);
          const contact_info = createInput('contact_info', 'Email de contacts:', inputValueArr[3]);
          const company_id = createInput('id', 'ID d\'intreprise', inputValueArr[4]);
          const submit = document.createElement('p');
          const submitInput = document.createElement('input');
          submitInput.setAttribute('type', 'submit');
          submitInput.setAttribute('value', 'Modifier');
          legend.appendChild(legendText);
          legend.appendChild(iconClose);
          fieldset.appendChild(legend);
          fieldset.appendChild(company_id);
          fieldset.appendChild(company);
          fieldset.appendChild(company_adress);
          fieldset.appendChild(contact_name);
          fieldset.appendChild(contact_info);
          fieldset.appendChild(submitInput);
          form.appendChild(fieldset);
          document.getElementById('update-query').appendChild(form);
          document.getElementById('close-update-form').addEventListener('click', function(){
            document.getElementById('update-query').removeChild(form);
          })
        }
      }
    })
  }
// Delete the company
  const deleteBtn = document.querySelectorAll('.create-delete-request');
  const createModal = (elem, attributeArr, textNode) => {
    const myElem = document.createElement(elem);
    for(let i=0; i<attributeArr.length; i++){
      for (const property in attributeArr[i]) {
        myElem.setAttribute(`${property}`, `${attributeArr[i][property]}`);
      }
    }
    if(textNode !== undefined){
      const text = document.createTextNode(textNode);
      myElem.appendChild(text);
      return myElem;
    }
    return myElem;
  }
  // Create Bootstrap Modal to delete the company
  const myModal = createModal('div', [{"class": "modal fade"}, {"role": "dialog"}, {"id": "myModal"}]);
  const modalDialog = createModal('div', [{"class": "modal-dialog"}]);
  const modalContent = createModal('div', [{"class": "modal-content"}]);
  const modalHeader = createModal('div', [{"class": "modal-header"}]);
  const buttonModal = createModal('button', [{"type": "button"}, {"class": "close"}, {"data-dismiss": "modal"}]);
  buttonModal.innerHTML = '&times;';
  const heading4 = createModal('h4', [{"class":"modal-title"}], "Suppression de l'entreprise");
  const modalBody = createModal('div', [{"class": "modal-body"}]);
  const pInModalBody = createModal('p', [{}], "Voulez vous supprimer l'entreprise?");
  const modalFooter = createModal('div', [{"class": "modal-footer"}]);
  const buttonInFooter = createModal('div', [{"type": "button"}, {"class": "btn btn-default"}, {"data-dismis": "modal"}, {"id": "delete-query"}]);
  modalHeader.appendChild(heading4);
  modalHeader.appendChild(buttonModal);
  modalBody.appendChild(pInModalBody);
  modalFooter.appendChild(buttonInFooter);
  modalContent.appendChild(modalHeader);
  modalContent.appendChild(modalBody);
  modalContent.appendChild(modalFooter);
  modalDialog.appendChild(modalContent);
  myModal.appendChild(modalDialog);
  document.querySelector('body').appendChild(myModal);
  for(let i=0; i<deleteBtn.length; i++){
    deleteBtn[i].addEventListener('click', function(){
      const deleteAnchor = createModal('a', [{"href": `/delete/${deleteBtn[i].value}`}], 'Supprimer');
      document.getElementById('delete-query').appendChild(deleteAnchor);
      for(const child in (deleteBtn[i].parentNode).parentNode.children){
        let companyDetails = '';
        // get only name, adress, contact_name and contact_info for each company
        if(child <= 3){
          companyDetails += (deleteBtn[i].parentNode).parentNode.children[child].innerText;
        }
        const deleteDetails = createModal('p', [{}], companyDetails);
        modalBody.appendChild(deleteDetails);
      }
    })
  }
})
