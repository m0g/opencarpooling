Meteor.publish('lifts', function() {
  return Lifts.find();
});
