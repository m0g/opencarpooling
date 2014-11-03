Meteor.methods({
  citySearch: function(query) {
    check(query, String);

    var options = {
      params: {
        featureClass: "P",
        style: "full",
        country: 'fr',
        lang: 'fr',
        maxRows: 12,
        username: 'metacarpooling',
        name_startsWith: query
      }
    };

    var res = HTTP.get("http://ws.geonames.org/searchJSON", options);

    return res.data.geonames.map(function(geoname) {
      return { value: geoname.asciiName };
    });
  }
});
