Meteor.publish('lifts', function() {
  return Lifts.find({ activated: true });
});

Meteor.publish('latestLifts', function() {
  var today = moment().toDate();

  return Lifts.find(
    { activated: true },
    { date: { $gte : today }},
    { sort: { date: -1 }}
  );
});

Meteor.publish('liftsSearch', function(from, to, when) {
  check(from, String);
  check(to, String);
  check(when, String);

  // Need to get the coords for from & to
  var self = this
    , date = moment(when, 'DD-MM-YYYY')
    , dayAfter = moment(date).add('days', 1)
    , fromCoords = Meteor.call('citySearch', from)[0]
    , toCoords = Meteor.call('citySearch', to)[0];

  fromCoords = [ parseFloat(fromCoords.lat), parseFloat(fromCoords.lng) ];
  toCoords = [ parseFloat(toCoords.lat), parseFloat(toCoords.lng) ];
  console.log('date', date);

  // Prepare the queries
  var queryFrom = {
    $and: [{
      date: { $gte: date.toDate(), $lte: dayAfter.toDate() }
    },
    {
      fromLoc: { $near : { 
        $geometry: { 
          type : "Point" ,
          coordinates: fromCoords
        },
        $maxDistance : 50,
        $minDistance : 0
      }}
    }]
  },

  queryTo = {
    $and: [{
      date: { $gte: date.toDate(), $lte: dayAfter.toDate() }
    },
    {
      toLoc: { $near : { 
        $geometry: { 
          type : "Point" ,
          coordinates: toCoords
        },
        $maxDistance : 50,
        $minDistance : 0
      }}
    }]
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
