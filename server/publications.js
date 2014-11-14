Meteor.publish('lifts', function() {
  return Lifts.find();
});

Meteor.publish('liftsSearch', function(searchQuery) {
  //return Lifts.find();
  //return Lifts.find({}, {sort: {submitted: -1}});
  var lifts = Lifts.find({ fromLoc: { $geoWithin: { $centerSphere: [ [ -74, 40.74 ] ,
                                                         100 / 3959 ] } } } )
  console.log(lifts);
  return lifts;
});
