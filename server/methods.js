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
    //return geoname.getCities(query);
  },

  directionsSearch: function(from, to) {
    check(from, String);
    check(to, String);

    var line = [];
    var options = { params: { origin: from, destination: to }};

    var res = HTTP.get("http://maps.googleapis.com/maps/api/directions/json", options);

    var startLocation = res.data.routes[0].legs[0].start_location;
    line.push([ startLocation.lat, startLocation.lng ]);

    res.data.routes[0].legs[0].steps.forEach(function(step) {
      line.push([ step.end_location.lat, step.end_location.lng ]);
    });

    return line;
  }
});
