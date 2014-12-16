Meteor.publish('lifts', function() {
  return Lifts.find();
});

Meteor.publish('liftsSearch', function() {
  var query = { fromLoc: { $near : { 
    $geometry: { 
      type : "Point" ,
      coordinates: [ 6.11667, 45.9 ]
    } },
    $maxDistance : 50
  }};

  return Lifts.find(query);
});
