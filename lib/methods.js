Meteor.methods({
  sendActivationCode: function(liftId, email) {
    check(liftId, String);
    check(email, String);

    console.log('liftid', liftId);
    console.log('rand', Random.id());

    var user = Meteor.users.find({ emails: { $elemMatch: { address: email } } });
    var lift = Lifts.findOne({ _id: liftId });

    if (!user)
      user = Meteor.users.insert({ username: email, emails: [email] });

    if (lift) {
      Lifts.update(liftId, { $set: { userId: user.id }});

      var token = jwt.encode({ liftId: liftId, userId: user.id }, Meteor.settings.secret);
      var body = [
        '<a href="http://localhost:3000/activatelift/',
        token,
        '">Activate your lift</a>'
      ].join('');

      var mailSent = Meteor.Mandrill.send({
        host:           "smtp.mandrillapp.com",
        port:           587,
        to:             email,
        from:           "info@opencarpooling.meteor.com",
        subject:        'Activation mail',
        html:           body,
        authentication: "LOGIN",
        username:       Meteor.settings.mandrill.username,
        password:       Meteor.settings.mandrill.password
      });

      return { liftId: liftId };
    }
  }
});

