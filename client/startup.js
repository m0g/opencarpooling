var getUserLanguage = function () {
  // Put here the logic for determining the user language

  return "fr";
};

Meteor.startup(function() {
  //L.mapbox.accessToken = Meteor.settings.public.mapboxApiKey;

  Session.set("showLoadingIndicator", true);

  //moment.locale(getUserLanguage());
  moment.locale('fr');
  console.log(moment.locale());

  TAPi18n.setLanguage(getUserLanguage())
    .done(function () {
      Session.set("showLoadingIndicator", false);
    })
    .fail(function (error_message) {
      // Handle the situation
      console.log(error_message);
    });
});
