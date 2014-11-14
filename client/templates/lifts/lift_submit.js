var map = null
  , polyline = null

  , markerFrom = null
  , markerFromLat = 0
  , markerFromLng = 0

  , markerTo = null
  , markerToLat = 0
  , markerToLng = 0;

var initLiftMap = function() {
  map = L.mapbox.map('form-map', Meteor.settings.public.mapboxMapName)
    .setView([ 46.088, 2.219 ], 6);

  polyline = L.polyline([]).addTo(map);
},

mapDrawLine = function() {
  var from = [ markerFromLat, markerFromLng ].join(',');
  var to = [ markerToLat, markerToLng ].join(',');

  Meteor.call('directionsSearch', from, to, function(err, res) {
    polyline.spliceLatLngs(0, 1000);

    res.forEach(function(latLng) {
      polyline.addLatLng(latLng);
    });

    map.fitBounds(polyline.getBounds());
  });
},

hiddenInputMutation = function(mutations) {
  mutations.forEach(function (mutation) {
    if (mutation.target.name == 'from-lat')
      markerFromLat = mutation.target.value;
    else if (mutation.target.name == 'from-lng')
      markerFromLng = mutation.target.value;
    else if (mutation.target.name == 'to-lat')
      markerToLat = mutation.target.value;
    else if (mutation.target.name == 'to-lng')
      markerToLng = mutation.target.value;

    console.log(mutation.target.name, mutation.target.value);

    if (markerFromLat && markerFromLng) {
      if (!markerFrom) {
        markerFrom = new L.Marker(new L.LatLng(markerFromLat, markerFromLng));
        map.addLayer(markerFrom);
      } else markerFrom.setLatLng(new L.LatLng(markerFromLat, markerFromLng));
    }

    if (markerToLat && markerToLng) {
      if (!markerTo) {
        markerTo = new L.Marker(new L.LatLng(markerToLat, markerToLng));
        map.addLayer(markerTo);
      } else markerTo.setLatLng(new L.LatLng(markerToLat, markerToLng));
    }

    if (markerFromLat && markerFromLng && markerToLat && markerToLng)
      mapDrawLine();
  });
},

monitorHiddenInputChanges = function(fromLat, fromLng, toLat, toLng) {
  var observer = new MutationObserver(hiddenInputMutation);

  observer.observe(fromLat, { attributes: true });
  observer.observe(fromLng, { attributes: true });

  observer.observe(toLat, { attributes: true });
  observer.observe(toLng, { attributes: true });

  var records = observer.takeRecords();
  console.log(records);
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

  initLiftMap();
  monitorHiddenInputChanges(fromLat, fromLng, toLat, toLng);
};

Template.liftSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var lift = {
      from: $(e.target).find('[name=from]').val(),

      //fromLoc: [ $(e.target).find('[name=from-lat]').val(),
      //           $(e.target).find('[name=from-lng]').val() ],

      to: $(e.target).find('[name=to]').val(),

      //toLoc: [ $(e.target).find('[name=to-lat]').val(),
      //         $(e.target).find('[name=to-lng]').val() ],

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
