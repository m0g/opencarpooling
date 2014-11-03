Meteor.methods({
  citySearch: function(query) {
    check(query, String);

    var geoname = new Geonames();
    return geoname.getCities(query);
  }
});
