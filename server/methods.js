Meteor.methods({
  citySearch: function(query) {
    check(query, String);

    var citiesCache = CitiesCache.findOne({ query: query });
    console.log(citiesCache);

    if (citiesCache) return citiesCache.autoCompletion;

    var geoname = new Geonames();
    var autoCompletion = geoname.getCities(query);

    var citiesCacheId = CitiesCache.insert({ query: query, autoCompletion: autoCompletion });

    return autoCompletion;
  },

  getCity: function(query) {
   check(query, String);

    var citiesCache = CitiesCache.findOne({ query: query });

    if (citiesCache)
      return { value: citiesCache.autoCompletion[0].value,
               loc: [ parseFloat(citiesCache.autoCompletion[0].lng),
                      parseFloat(citiesCache.autoCompletion[0].lat) ] };

    var geoname = new Geonames();
    var autoCompletion = geoname.getCities(query);

    var citiesCacheId = CitiesCache.insert({ query: query, autoCompletion: autoCompletion });

    return { value: autoCompletion[0].value,
             loc: [ parseFloat(autoCompletion[0].lng), parseFloat(autoCompletion[0].lat)]};
  },

  directionsSearch: function(from, to) {
    check(from, String);
    check(to, String);

    var directionsCache = DirectionsCache.findOne({ from: from, to: to });
    if (directionsCache) return directionsCache;

    var line = [];
    var options = { params: { origin: from, destination: to }};

    var res = HTTP.get("http://maps.googleapis.com/maps/api/directions/json", options);

    if (res.data.status == 'ZERO_RESULTS') {
      console.log(options);
      DirectionsCache.remove({ from: from, to: to });
      return false;
    }

    var startLocation = res.data.routes[0].legs[0].start_location
      , duration = res.data.routes[0].legs[0].duration.text
      , distance = res.data.routes[0].legs[0].distance.text;

    line.push([ startLocation.lat, startLocation.lng ]);

    res.data.routes[0].legs[0].steps.forEach(function(step) {
      line.push([ step.end_location.lat, step.end_location.lng ]);
    });

    directionsCache = {
      from: from, to: to, line: line, distance: distance, duration: duration
    };

    var directionsCacheId = DirectionsCache.insert(directionsCache);

    return directionsCache;
  },

  //sendActivationCode: function(liftId, email) {
  //  check(liftId, String);
  //  check(email, String);

  //  console.log('liftid', liftId);
  //  console.log('rand', Random.id());

  //  var user = Meteor.users.find({ emails: { $elemMatch: { address: email } } });
  //  var lift = Lifts.findOne({ _id: liftId });

  //  if (!user)
  //    user = Meteor.users.insert({ username: email, emails: [email] });

  //  if (lift) {
  //    Lifts.update(liftId, { $set: { userId: user.id }});

  //    var token = jwt.encode({ liftId: liftId, userId: user.id }, Meteor.settings.secret);
  //    var body = [
  //      '<a href="http://localhost:3000/activatelift/',
  //      token,
  //      '">Activate your lift</a>'
  //    ].join('');

  //    var mailSent = Meteor.Mandrill.send({
  //      host:           "smtp.mandrillapp.com",
  //      port:           587,
  //      to:             email,
  //      from:           "info@opencarpooling.meteor.com",
  //      subject:        'Activation mail',
  //      html:           body,
  //      authentication: "LOGIN",
  //      username:       Meteor.settings.mandrill.username,
  //      password:       Meteor.settings.mandrill.password
  //    });

  //    return { liftId: liftId };
  //  }
  //},

  liftActivate: function(token) {
    check(token, String);

    var decoded = jwt.decode(token, Meteor.settings.secret);
    console.log('decoded', decoded); //=> { foo: 'bar' }

    if (decoded.liftId) {
      var updatedLifts = Lifts.update(decoded.liftId, { $set: { activated: true }});
      console.log('upd', updatedLifts);
      return { _id: decoded.liftId };
    } else
      return false;
  },

  sendMail: function(to, subject, html) {
    wrappedMandrillSend = Meteor.wrapAsync(Meteor.Mandrill.send);

    var result = wrappedMandrillSend({
      host:           "smtp.mandrillapp.com",
      port:           587,
      to:             to,
      from:           "info@opencarpooling.meteor.com",
      subject:        subject,
      html:           html,
      authentication: "LOGIN",
      username:       Meteor.settings.mandrill.username,
      password:       Meteor.settings.mandrill.password
    });

    console.log('sending a mail', result);

    return result;
  }
});
