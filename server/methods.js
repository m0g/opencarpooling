Meteor.methods({
  citySearch: function(query) {
    check(query, String);

    var citiesCache = CitiesCache.findOne({ query: query });
    console.log(citiesCache);

    if (citiesCache) return citiesCache.autoCompletion;

    var geoname = new Geonames();
    var autoCompletion = geoname.getCities(query);

    var citiesCacheId = CitiesCache.insert({ query: query, autoCompletion: autoCompletion });

    return autoCompletion;
  },

  directionsSearch: function(from, to) {
    check(from, String);
    check(to, String);

    var directionsCache = DirectionsCache.findOne({ from: from, to: to });
    if (directionsCache) return directionsCache;

    var line = [];
    var options = { params: { origin: from, destination: to }};

    var res = HTTP.get("http://maps.googleapis.com/maps/api/directions/json", options);

    var startLocation = res.data.routes[0].legs[0].start_location
      , duration = res.data.routes[0].legs[0].duration.text
      , distance = res.data.routes[0].legs[0].distance.text;

    line.push([ startLocation.lat, startLocation.lng ]);

    res.data.routes[0].legs[0].steps.forEach(function(step) {
      line.push([ step.end_location.lat, step.end_location.lng ]);
    });

    var directionsCache = {
      from: from, to: to, line: line, distance: distance, duration: duration
    };

    var directionsCacheId = DirectionsCache.insert(directionsCache);

    return directionsCache;
  },

  sendMail: function() {
    console.log('sending a mail');

    Meteor.Mandrill.send({
      host:           "smtp.mandrillapp.com"
      , port:           587
      , to:             "nogues.loic@gmail.com"
      , from:           "info@opencarpooling.meteor.com"
      , subject:        "Mandrill knows Javascript!"
      , body:           "Hello from NodeJS!"
      , authentication: "LOGIN"
      , username:       Meteor.settings.mandrill.username
      , password:       Meteor.settings.mandrill.password
      }, function(err, result){
        console.log('mail sent?', err, results);
      }
    );
  }
});
