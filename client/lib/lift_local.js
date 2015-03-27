LiftLocal = {
  liftVars: [
    { name: 'from', param: 'from' },
    { name: 'fromLat', param: 'from-lat' },
    { name: 'fromLng', param: 'from-lng' },
    { name: 'to', param: 'to' },
    { name: 'toLat', param: 'to-lat' },
    { name: 'toLng', param: 'to-lng' },
    { name: 'date', param: 'date' },
    { name: 'time', param: 'time' },
    { name: 'price', param: 'price' },
    { name: 'info', param: 'info' }
  ],

  retrieve: function(callback) {
    var lift = lscache.get('liftSubmit');

    if (!lift) return false;

    LiftLocal.liftVars.forEach(function(liftVar) {
      $('form.main.form')
        .find('[name=' + liftVar.param + ']')
        .val(lift[liftVar.name]);
    });

    callback(lift);
  },

  retrieveSeats: function(callback) {
    var lift = lscache.get('liftSubmit');
    callback((lift) ? lift.seats : 0);
  },

  store: function() {
    var cachedLift = lscache.get('liftSubmit');
    var lift = {};

    LiftLocal.liftVars.forEach(function(liftVar) {
      lift[liftVar.name] = $('form.main.form').find('[name='+ liftVar.param +']').val();

      if (!lift[liftVar.name] && (cachedLift && cachedLift[liftVar.name]))
        lift[liftVar.name] = cachedLift[liftVar.name];
    });

    lscache.set('liftSubmit', lift, 200);
  },

  storeSeats: function(seats) {
    var cachedLift = lscache.get('liftSubmit');
    cachedLift.seats = seats;
    lscache.set('liftSubmit', cachedLift, 200);
  }
};
