Meteor.methods({
  citySearch: function(query) {
    check(query, String);

    var citiesCache = CitiesCache.findOne({ query: query });
    console.log(citiesCache);

    if (citiesCache) return citiesCache.autoCompletion;

    var geoname = new Geonames();
    var autoCompletion = geoname.getCities(query);

    var citiesCacheId = CitiesCache.insert({ query: query, autoCompletion: autoCompletion });
    console.log(citiesCacheId);

    return autoCompletion;
  },

  directionsSearch: function(from, to) {
    check(from, String);
    check(to, String);

    var directionsCache = DirectionsCache.findOne({ from: from, to: to });
    if (directionsCache) return directionsCache.line;

    var line = [];
    var options = { params: { origin: from, destination: to }};

    var res = HTTP.get("http://maps.googleapis.com/maps/api/directions/json", options);

    var startLocation = res.data.routes[0].legs[0].start_location;
    line.push([ startLocation.lat, startLocation.lng ]);

    res.data.routes[0].legs[0].steps.forEach(function(step) {
      line.push([ step.end_location.lat, step.end_location.lng ]);
    });

    var directionsCacheId = DirectionsCache.insert({ from: from, to: to, line: line });
    return line;
  },

  liftsSearch: function(searchQuery) {
    console.log(searchQuery);

    check(searchQuery.from, String);
    check(searchQuery.to, String);
    check(searchQuery.when, String);

    var query = { fromLoc: { $near : { 
      $geometry: { 
        type : "Point" ,
        coordinates: [ 6.11667, 45.9 ]
      } },
      $maxDistance : 10000
    }};

    var lifts = Lifts.find(query);
    return lifts.fetch();
  }
});
