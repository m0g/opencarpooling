Meteor.publish('lifts', function() {
  return Lifts.find();
});

Meteor.publish('latestLifts', function() {
  var today = moment().toDate();

  return Lifts.find(
    { date: { $gte : today }},
    { sort: { date: -1 }}
  );
});

Meteor.publish('liftsSearch', function(from, to, when) {
  check(from, String);
  check(to, String);
  check(when, String);

  // Need to get the coords for from & to
  var fromCoords = CitiesCache.findOne({ query: from }).autoCompletion[0];
  fromCoords = [ parseFloat(fromCoords.lat), parseFloat(fromCoords.lng) ];

  var toCoords = CitiesCache.findOne({ query: to }).autoCompletion[0];
  toCoords = [ parseFloat(toCoords.lat), parseFloat(toCoords.lng) ];

  var self = this;

  // Prepare the queries
  var queryFrom = {
    fromLoc: { $near : { 
      $geometry: { 
        type : "Point" ,
        coordinates: fromCoords
      },
      $maxDistance : 50,
      $minDistance : 0
    }}
  },

  queryTo = {
    toLoc: { $near : { 
      $geometry: { 
        type : "Point" ,
        coordinates: toCoords
      },
      $maxDistance : 50,
      $minDistance : 0
    }}
  };

  // geoNear queries don't work with more than one near value.
  // So we execute two different queries that we will then merge
  // into one cursor (using the Meteor API).
  Lifts.find(queryFrom).forEach(function(result) {
    if (JSON.stringify(result.toLoc) == JSON.stringify(toCoords)) {
      self.added("lifts", result._id, result);
    }
  });

  Lifts.find(queryTo).forEach(function(result) {
    if (JSON.stringify(result.fromLoc) == JSON.stringify(fromCoords)) {
      self.added("lifts", result._id, result);
    }
  });

  self.ready();
});
