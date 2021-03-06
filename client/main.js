Handlebars.registerHelper("debug", function(optionalValue) { 
  console.log("Current Context");
  console.log("====================");
  console.log(this);

  if (optionalValue) {
    console.log("Value"); 
    console.log("===================="); 
    console.log(optionalValue); 
  } 
});

Handlebars.registerHelper('formatDate', function(date) {
  return moment(date).tz('Europe/Paris').format('dddd D MMMM YYYY - HH:mm');
});
