Meteor.startup(function() {
  L.mapbox.accessToken = Meteor.settings.public.mapboxApiKey;
});
