var map = null;

var checkLocalStorage = function() {
  var lift = lscache.get('liftSubmit');

  console.log(lift);
  if (!lift) return false;

  $('form.main.form').find('[name=from]').val(lift.from);
  $('form.main.form').find('[name=to]').val(lift.to);
  $('form.main.form').find('[name=date]').val(lift.date);
  $('form.main.form').find('[name=price]').val(lift.price);
};

Template.liftSubmit.rendered = function() {
  var from = document.getElementById('from')
    , fromLat = document.getElementById('from-lat')
    , fromLng = document.getElementById('from-lng')

    , to = document.getElementById('to')
    , toLat = document.getElementById('to-lat')
    , toLng = document.getElementById('to-lng');

  Meteor.typeahead(from, function(query, callback) {
    if (query.length < 4) return [];

    Meteor.call('citySearch', query, function(err, res) {
      fromLat.value = res[0].lat;
      fromLng.value = res[0].lng;

      callback(res);
    });
  });

  Meteor.typeahead(to, function(query, callback) {
    if (query.length < 4) return [];

    Meteor.call('citySearch', query, function(err, res) {
      toLat.value = res[0].lat;
      toLng.value = res[0].lng;

      callback(res);
    });
  });

  Meteor.typeahead.inject();

  $('#date').datepicker({ format: 'DD/MM/YYYY' });

  checkLocalStorage();
  map = new Mapping('form-map', { polyline: true });
};

var inputChanged = function(e) {
  markerFromLat = parseFloat(document.getElementById('from-lat').value);
  markerFromLng = parseFloat(document.getElementById('from-lng').value);
  markerToLat = parseFloat(document.getElementById('to-lat').value);
  markerToLng = parseFloat(document.getElementById('to-lng').value);

  map.mapDirection(markerFromLat, markerFromLng, markerToLat, markerToLng);
},

storeLocally = function(e) {
  var cachedLift = lscache.get('liftSubmit');

  if (!cachedLift) return false;

  var lift = {
    from: cachedLift.from || $('form.main.form').find('[name=from]').val(),
    to: cachedLift.to || $('form.main.form').find('[name=to]').val(),
    date: cachedLift.date || $('form.main.form').find('[name=date]').val(),
    price: cachedLift.price || $('form.main.form').find('[name=price]').val()
  };


  lscache.set('liftSubmit', lift, 200);
};

Template.liftSubmit.events({
  'keyup #from': inputChanged,
  'keyup #to': inputChanged,

  'change #from': storeLocally,
  'change #to': storeLocally,
  'change #date': storeLocally,
  'change #price': storeLocally,

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
