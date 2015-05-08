if (Lifts.find().count() === 0) {
  // ensureIndex on the server side
  Lifts._ensureIndex({ fromLoc: "2dsphere" });
  Lifts._ensureIndex({ toLoc: "2dsphere" });

  var today = moment();
  var tomorrow = moment(today).add('days', 1);
  var afterTomorrow = moment(today).add('days', 2);
  var info = 'Lorem dolor sit amet';

  var defaultLifts = [
    { from: 'Annecy', to: 'Lyon', date: tomorrow.toDate(), price: 22, info: '..', seats: 4 },
    { from: 'Paris', to: 'Rennes', date: afterTomorrow.toDate(),
      price: 20, info: info, seats: 2 },
    { from: 'Annecy', to: 'Lyon', date: tomorrow.toDate(), price: 20, info: info, seats: 2 },
  ];

  defaultLifts.forEach(function(lift) {
    Meteor.call('liftInsert', lift, function(err, res) {
      console.log(err);
      console.log(res);
    });
  });
} 

Meteor.startup(function() {
  return Meteor.Mandrill.config({
    username: Meteor.settings.mandrill.username,
    key: Meteor.settings.mandrill.password,
    password: Meteor.settings.mandrill.username,
  });
});
