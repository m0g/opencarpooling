Template.liftsList.rendered = function() {
  var from = document.getElementById('from');
  var to = document.getElementById('to');

  var typeaheadCallback = function(query, callback) {
    Meteor.call('citySearch', query, function(err, res) {
      console.log(res);
      callback(res);
    });
  };

  Meteor.typeahead(from, typeaheadCallback);
  Meteor.typeahead(to, typeaheadCallback);
  Meteor.typeahead.inject();

  $('#when').datepicker({ format: 'DD/MM/YYYY' });
};

Template.liftsList.helpers({
  lifts: function() {
    return Lifts.find({}, {sort: {submitted: -1}});
  }
});
