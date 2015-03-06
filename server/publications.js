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

  console.log(fromCoords);
  console.log(toCoords);

  var query = { $and: [
    {
      fromLoc: { $near : { 
        $geometry: { 
          type : "Point" ,
          coordinates: fromCoords
        },
        $maxDistance : 50,
        $minDistance : 10
      }}
    },
    {
      toLoc: { $near : { 
        $geometry: { 
          type : "Point" ,
          coordinates: toCoords
        },
        $maxDistance : 50,
        $minDistance : 10
      }}
    }
  ]};

  return Lifts.find(query);
});
