var getUserLanguage = function () {
  // Put here the logic for determining the user language

  return "fr";
};

Meteor.startup(function() {
  L.Icon.Default.imagePath = '/images';

  Session.set("showLoadingIndicator", true);

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
