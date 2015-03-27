var map = null;

var checkLocalStorage = function() {
  var lift = lscache.get('liftSubmit');

  if (!lift) return false;

  $('form.main.form').find('[name=from]').val(lift.from);
  $('form.main.form').find('[name=from-lat]').val(lift.fromLat);
  $('form.main.form').find('[name=from-lng]').val(lift.fromLng);

  $('form.main.form').find('[name=to]').val(lift.to);
  $('form.main.form').find('[name=to-lat]').val(lift.toLat);
  $('form.main.form').find('[name=to-lng]').val(lift.toLng);

  $('form.main.form').find('[name=date]').val(lift.date);
  $('form.main.form').find('[name=time]').val(lift.time);
  $('form.main.form').find('[name=price]').val(lift.price);

  if (lift.from.length > 0 && lift.to.length > 0) inputChanged();
},

inputChanged = function(e) {
  var markerFromLat = parseFloat(document.getElementById('from-lat').value);
  var markerFromLng = parseFloat(document.getElementById('from-lng').value);
  var markerToLat = parseFloat(document.getElementById('to-lat').value);
  var markerToLng = parseFloat(document.getElementById('to-lng').value);

  if (markerFromLat && markerFromLng && markerToLat && markerToLng)
    map.mapDirection(markerFromLat, markerFromLng, markerToLat, markerToLng);
},

storeLocally = function(e) {
  var cachedLift = lscache.get('liftSubmit');

  var lift = {
    from: $('form.main.form').find('[name=from]').val() || (cachedLift && cachedLift.from),
    fromLat: $('form.main.form').find('[name=from-lat]').val() || (cachedLift && cachedLift.fromLat),
    fromLng: $('form.main.form').find('[name=from-lng]').val() || (cachedLift && cachedLift.fromLng),

    to: $('form.main.form').find('[name=to]').val() || (cachedLift && cachedLift.to),
    toLat: $('form.main.form').find('[name=to-lat]').val() || (cachedLift && cachedLift.toLat),
    toLng: $('form.main.form').find('[name=to-lng]').val() || (cachedLift && cachedLift.toLng),

    date: $('form.main.form').find('[name=date]').val() || (cachedLift && cachedLift.date),
    time: $('form.main.form').find('[name=time]').val() || (cachedLift && cachedLift.time),
    price: $('form.main.form').find('[name=price]').val() || (cachedLift && cachedLift.price)
  };

  lscache.set('liftSubmit', lift, 200);
};

Template.liftSubmit.helpers({
  loadingFrom: function() {
    return Session.get('loading-from');
  },

  loadingTo: function() {
    return Session.get('loading-to');
  }
});

Template.liftSubmit.rendered = function() {
  Session.set('loading-from', false);
  Session.set('loading-to', false);

  var from = document.getElementById('from')
    , fromLat = document.getElementById('from-lat')
    , fromLng = document.getElementById('from-lng')

    , to = document.getElementById('to')
    , toLat = document.getElementById('to-lat')
    , toLng = document.getElementById('to-lng');

  Meteor.typeahead(from, function(query, callback) {
    if (query.length < 4) return [];
    Session.set('loading-from', true);

    Meteor.call('citySearch', query, function(err, res) {
      fromLat.value = res[0].lat;
      fromLng.value = res[0].lng;

      Session.set('loading-from', false);
      storeLocally();
      callback(res);
    });
  });

  Meteor.typeahead(to, function(query, callback) {
    if (query.length < 4) return [];
    Session.set('loading-to', true);

    Meteor.call('citySearch', query, function(err, res) {
      toLat.value = res[0].lat;
      toLng.value = res[0].lng;

      Session.set('loading-to', false);
      storeLocally();
      callback(res);
    });
  });

  Meteor.typeahead.inject();

  $('#date').datepicker({
    startDate: '0',
    endDate: '+2m',
    format: 'dd/mm/yyyy'
  });

  $('.clockpicker').clockpicker();

  $('#seats').raty({ starType : 'i', scoreName: 'seats' });

  map = new Mapping('form-map', { deactivateZoom: true, polyline: true });
  map.setAsBackground();

  checkLocalStorage();
};

Template.liftSubmit.events({
  'keyup #from': inputChanged,
  'keyup #to': inputChanged,

  'change .changing': storeLocally,

  'submit form': function(e) {
    e.preventDefault();
    var date = moment(
      [ $(e.target).find('[name=date]').val(),
        $(e.target).find('[name=time]').val() ].join(' '),
      'DD-MM-YYYY hh:mm'
    );

    var lift = {
      from: $(e.target).find('[name=from]').val(),
      to: $(e.target).find('[name=to]').val(),
      date: date.toDate(),
      price: parseInt($(e.target).find('[name=price]').val()),
      seats: parseInt($(e.target).find('[name=seats]').val()),
      info: $(e.target).find('[name=info]').val()
    };

    Meteor.call('liftInsert', lift, function(error, result) {
      // display the error to the user and abort
      if (error)
        return alert(error.reason);

      // show this result but route anyway
      if (result.liftExists)
        alert('This link has already been posted');

      // Need to remove the input content too
      lscache.remove('liftSubmit')
      Router.go('liftPage', {_id: result._id});
    });
  }
});
