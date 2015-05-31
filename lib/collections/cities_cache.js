CitiesCache = new Mongo.Collection('citiesCache');

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

  getCity: function(query) {
   check(query, String);

    var citiesCache = CitiesCache.findOne({ query: query });

    if (citiesCache)
      return { value: citiesCache.autoCompletion[0].value,
               loc: [ parseFloat(citiesCache.autoCompletion[0].lng),
                      parseFloat(citiesCache.autoCompletion[0].lat) ] };

    var geoname = new Geonames();
    var autoCompletion = geoname.getCities(query);

    var citiesCacheId = CitiesCache.insert({ query: query, autoCompletion: autoCompletion });

    return { value: autoCompletion[0].value,
             loc: [ parseFloat(autoCompletion[0].lng), parseFloat(autoCompletion[0].lat)]};
  }
});
