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

addMarker = function(lat, lng, title) {
  L.mapbox.markerLayer({
    type: 'Feature',
    geometry: {
        type: 'Point',
        coordinates: [ lat, lng ]
    },
    properties: {
      title: title,
      description: '1718 14th St NW, Washington, DC',
      'marker-size': 'large'
    }
  }).addTo(map);
},

mapDrawLine = function() {
  var from = [ markerFromLng, markerFromLat ].join(',');
  var to = [ markerToLng, markerToLat ].join(',');

  addMarker(markerFromLat, markerFromLng, 'From');
  addMarker(markerToLat, markerToLng, 'To');

  Meteor.call('directionsSearch', from, to, function(err, res) {
    console.log(res);
    polyline.spliceLatLngs(0, 1000);

    res.forEach(function(latLng) {
      polyline.addLatLng(latLng);
    });

    map.fitBounds(polyline.getBounds());
  });
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
  //monitorHiddenInputChanges(fromLat, fromLng, toLat, toLng);
};

var inputChanged = function(e) {
  markerFromLat = parseFloat(document.getElementById('from-lat').value);
  markerFromLng = parseFloat(document.getElementById('from-lng').value);
  markerToLat = parseFloat(document.getElementById('to-lat').value);
  markerToLng = parseFloat(document.getElementById('to-lng').value);

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
};

Template.liftSubmit.events({
  'change #from': inputChanged,
  'change #to': inputChanged,

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
