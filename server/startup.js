if (Lifts.find().count() === 0) {
  // ensureIndex on the server side
  Lifts._ensureIndex({ fromLoc: "2dsphere" });
  Lifts._ensureIndex({ toLoc: "2dsphere" });

  var date = new Date();

  var defaultLifts = [
    { from: 'Annecy', to: 'Lyon', date: date, price: '22' }
  ];

  defaultLifts.forEach(function(lift) {
    Meteor.call('liftInsert', lift, function(err, res) {
      console.log(err);
      console.log(res);
    });
  });
} 
