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

  $('#when').datepicker({ format: 'DD-MM-YYYY' });

  var map = new Mapping('bg-map', { deactivateZoom: true }).setAsBackground();
};

Template.liftsList.helpers({
  lifts: function() {
    return Lifts.find({}, {sort: {submitted: -1}});
  }
});

Template.liftsList.events({
  'submit form': function(e) {
    e.preventDefault();

    var searchQuery = {
      from: $(e.target).find('[name=from]').val(),
      to: $(e.target).find('[name=to]').val(),
      when: $(e.target).find('[name=when]').val()
    };

    Router.go('liftsSearch', searchQuery);
  }
});
