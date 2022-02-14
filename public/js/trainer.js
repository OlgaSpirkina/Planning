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
  const theform = createForm('form', null, null);
  const fieldset = createForm('fieldset', null, null);
  
  btnModifyPersoInfo.addEventListener('click', function(){
    console.log(btnModifyPersoInfo.value)
  })
})
