window.addEventListener('load', function () {
  const btnModifyPersoInfo = document.getElementById('btn-perso-info');
  const createForm = (elem, attributes, text) => {
    const theelem = document.createElement(elem);
    if(attributes !== null){
      for(let i=0; i<attributes.length; i++){
        for(key in attributes[i]){
          theelem.setAttribute(key, attributes[i][key]);
        }
      }
    }
    if(text !== null){
      thetext = document.createTextNode(text);
      theelem.appendChild(thetext);
    }
    return theelem;
  }
  const theform = createForm('form', [{'method': 'POST'}], null);
  const fieldset = createForm('fieldset', null, null);
  const createFiveInputs = (inputname, inputtipe, inputvalue, text) => {
    const p = createForm('p', null, null);
    const label = createForm('label', [{"for": inputname}], text);
    const input = createForm('input', [{"type": inputtipe}, {"name": inputname}, {"id": inputname}, {"value": inputvalue}], null);
    p.appendChild(label);
    p.appendChild(input);
    return p
  }
  btnModifyPersoInfo.addEventListener('click', function(){

      const idPut = createFiveInputs('idput', 'text', document.getElementById('btn-perso-info').value, 'id');
      const pFname = createFiveInputs('fnameput', 'text', document.getElementById('fname-put').innerText, 'nom de famille');
      const pName = createFiveInputs('nameput', 'text', document.getElementById('name-put').innerText, 'prénom');
      const pEmail = createFiveInputs('emailput', 'text', document.getElementById('email-put').innerText, 'adress email');
      const pPhone = createFiveInputs('mobileput', 'number', document.getElementById('mobile-put').innerText, 'numéro de téléphone');
      const pUsername = createFiveInputs('usernameput','text', document.getElementById('username-put').textContent, 'username');
      const pForBtnUpdate = createForm('p', [{}], null);
      const btnUpdate = createForm('input', [{"type": "submit"}, {"value": "modifier"}, {"id": "btn-update"}], null)
      const legend = createForm('legend', [{}], "Modifier les informations personnelles");
      const spanClose = createForm('span', [{"id": "span-close"}], "x");
      fieldset.appendChild(legend);
      theform.appendChild(spanClose);
      fieldset.appendChild(idPut);
      fieldset.appendChild(pFname);
      fieldset.appendChild(pName);
      fieldset.appendChild(pEmail);
      fieldset.appendChild(pPhone);
      fieldset.appendChild(pUsername);
      pForBtnUpdate.appendChild(btnUpdate);
      fieldset.appendChild(pForBtnUpdate);
      theform.appendChild(fieldset);
      document.getElementById('parent-perso-info').setAttribute('hidden', true);
      document.getElementById('form-update-perso-info').appendChild(theform);
      const inputPut = document.querySelectorAll('#form-update-perso-info input[type="text"]');
      for(let i=0; i<inputPut.length; i++){
        let usernameupdate = '';
        inputPut[i].addEventListener('change', function(){
          inputPut[inputPut.length-1].value = inputPut[2].value + inputPut[1].value;
        })
      }
      document.getElementById('span-close').addEventListener('click', function(){
        document.getElementById('parent-perso-info').removeAttribute('hidden', true);
        if((theform.hasChildNodes()) || (fieldset.hasChildNodes())){
          while (theform.firstChild) {
            theform.firstChild.remove()
          }
          while (fieldset.firstChild) {
            fieldset.firstChild.remove()
          }
        }else{
          document.getElementById('form-update-perso-info').removeChild(theform);
        }
      })

  })
})
