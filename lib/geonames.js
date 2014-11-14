Geonames = function() {
  this.options = {
    params: {
      featureClass: "P",
      style: "full",
      country: 'fr',
      lang: 'fr',
      maxRows: 12,
      username: 'metacarpooling',
      name_startsWith: ''
    }
  };
};

Geonames.prototype.getCity = function(query) {
  this.options.params.name_startsWith = query;

  var res = HTTP.get("http://ws.geonames.org/searchJSON", this.options);
  var geoname = res.data.geonames[0];

  if (res.data.geonames.length > 0)
    return { value: geoname.asciiName, loc: [ geoname.lat, geoname.lng ] };
  else
    return false;
};

Geonames.prototype.getCities = function(query) {
  this.options.params.name_startsWith = query;

  var res = HTTP.get("http://ws.geonames.org/searchJSON", this.options);

  return res.data.geonames.map(function(geoname) {
    return { value: geoname.asciiName, lat: geoname.lat, lng: geoname.lng };
  });
};

return Geonames;
