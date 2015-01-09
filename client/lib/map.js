Mapping = function(tagId, opts) {
  this.markerFrom = null;
  this.markerFromLat = 0;
  this.markerFromLng = 0;

  this.markerTo = null;
  this.markerToLat = 0;
  this.markerToLng = 0;

  var self = this;

  if (opts.deactivateZoom)
    this.map = L.map(tagId, Meteor.settings.public.mapboxMapName, {
      zoomControl: false
    });
  else
    this.map = L.map(tagId, Meteor.settings.public.mapboxMapName);

  this.map.setView([ 46.088, 2.219 ], 6);

  if (opts.polyline)
    this.polyline = L.polyline([]).addTo(this.map);

  L.tileLayer('http://{s}.tile.osm.org/{z}/{x}/{y}.png', {
    attribution: '&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
  }).addTo(this.map);

  HTTP.get("/geojson/regions.geojson", function(err, res) {
    var france = L.geoJson(JSON.parse(res.content));
    france.addTo(self.map);
  });
};

Mapping.prototype.setAsBackground = function() {
  this.map.dragging.disable();
  this.map.touchZoom.disable();
  this.map.doubleClickZoom.disable();
  this.map.scrollWheelZoom.disable();

  // Disable tap handler, if present.
  if (this.map.tap) this.map.tap.disable();
}

Mapping.prototype.addMarker = function(lat, lng, title) {
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
  }).addTo(this.map);
};

Mapping.prototype.mapDirection = function(mFromLat, mFromLng, mToLat, mToLng) {
  this.markerFromLat = mFromLat;
  this.markerFromLng = mFromLng;

  this.markerToLat = mToLat;
  this.markerToLng = mToLng;

  if (this.markerFromLat && this.markerFromLng) {
    if (!this.markerFrom) {
      this.markerFrom = new L.Marker(new L.LatLng(this.markerFromLat, this.markerFromLng));
      this.map.addLayer(this.markerFrom);
    } else this.markerFrom.setLatLng(new L.LatLng(this.markerFromLat, this.markerFromLng));
  }

  if (this.markerToLat && this.markerToLng) {
    if (!this.markerTo) {
      this.markerTo = new L.Marker(new L.LatLng(this.markerToLat, this.markerToLng));
      this.map.addLayer(this.markerTo);
    } else this.markerTo.setLatLng(new L.LatLng(this.markerToLat, this.markerToLng));
  }

  if (this.markerFromLat && this.markerFromLng && this.markerToLat && this.markerToLng)
    this.drawPolyline();
};

Mapping.prototype.drawPolyline = function() {
  var from = [ this.markerFromLng, this.markerFromLat ].join(',');
  var to = [ this.markerToLng, this.markerToLat ].join(',');
  var self = this;

  this.addMarker(this.markerFromLat, this.markerFromLng, 'From');
  this.addMarker(this.markerToLat, this.markerToLng, 'To');

  Meteor.call('directionsSearch', from, to, function(err, res) {
    self.polyline.spliceLatLngs(0, 1000);

    if (!res) return false;

    res.forEach(function(latLng) {
      self.polyline.addLatLng(latLng);
    });

    self.map.fitBounds(self.polyline.getBounds());
  });
};
