window.addEventListener('load', function () {
  const linksInHeader = document.querySelectorAll('.link-in-header');
  for(let i=0; i<linksInHeader.length; i++){
    if(linksInHeader[i].href === window.location.href){
      linksInHeader[i].style.color = "#f19711";
    }else{
      linksInHeader[i].addEventListener("mouseover", function(){
        linksInHeader[i].style.color = "#f19711";
      }, false);
      linksInHeader[i].addEventListener("mouseout", function(){
        linksInHeader[i].style.color = "#555";
      }, false);
    }
  }
})
