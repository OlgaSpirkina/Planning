window.addEventListener('load', function () {
  const monthNames = ["Janvier", "Février", "Mars", "Avril", "May", "Juin",
  "Juillet", "Août", "Septembre", "Octobre", "Novembre", "Décembre"
  ];
    const today = new Date();

  console.log(monthNames[today.getMonth()])
})
