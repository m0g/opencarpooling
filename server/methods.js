Meteor.methods({
  citySearch: function(query) {
    check(query, String);

    var uniqueArray = [];
    var results = [];

    var geo = new GeoCoder({
      geocoderProvider: "openstreetmap"
      //geocoderProvider: "google"
    });

    console.log('init geo');
    var places = geo.geocode(query + ", France");

    places.forEach(function(place) {
      if (typeof(place.city) != 'undefined')
        uniqueArray[place.city] = '';
    });

    console.log(uniqueArray);

    for (city in uniqueArray)
      results.push({ value: city });

    console.log(results);

    return results;
  }
});
