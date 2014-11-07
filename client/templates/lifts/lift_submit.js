var initBackgroundMap = function() {
  var map = L.mapbox.map('form-map', Meteor.settings.public.mapboxMapName)
    .setView([ 46.088, 2.219 ], 6);
};


Template.liftSubmit.rendered = function() {
  var from = document.getElementById('from');
  var to = document.getElementById('to');

  var typeaheadCallback = function(query, callback) {
    Meteor.call('citySearch', query, function(err, res) {
      callback(res);
    });
  };

  Meteor.typeahead(from, typeaheadCallback);
  Meteor.typeahead(to, typeaheadCallback);
  Meteor.typeahead.inject();

  $('#date').datepicker({ format: 'DD/MM/YYYY' });

  initBackgroundMap();
};

Template.liftSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var lift = {
      from: $(e.target).find('[name=from]').val(),
      to: $(e.target).find('[name=to]').val(),
      date: $(e.target).find('[name=date]').val(),
      price: $(e.target).find('[name=price]').val()
    };

    Meteor.call('liftInsert', lift, function(error, result) {
      // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // show this result but route anyway
      if (result.liftExists)
        alert('This link has already been posted');

      Router.go('liftPage', {_id: result._id});
    });
  }
});
