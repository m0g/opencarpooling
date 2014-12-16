Lifts = new Mongo.Collection('lifts');

Lifts.allow({
  update: function(userId, lift) {
    return ownsDocument(userId, lift);
  },

  remove: function(userId, lift) {
    return ownsDocument(userId, lift);
  },
});

Lifts.deny({  
  update: function(userId, lift, fieldNames) {
    // may only edit the following two fields:
    return (_.without(fieldNames, 'from', 'to', 'date', 'price').length > 0);
  }
});

Meteor.methods({
  liftInsert: function(liftAttributes) {
    check(Meteor.userId(), String);

    check(liftAttributes, {
      from: String,
      to: String,
      date: String,
      price: String
    });

    var geonames = new Geonames();

    var from = geonames.getCity(liftAttributes.from);
    var to = geonames.getCity(liftAttributes.to);

    liftAttributes.from = from.value;
    liftAttributes.to = to.value;

    var user = Meteor.user();

    var lift = _.extend(liftAttributes, {
      userId: user._id,
      author: user.username,
      fromLoc: from.loc,
      toLoc: to.loc,
      submitted: new Date()
    });

    var liftIdentical = Lifts.findOne({
      from: liftAttributes.from,
      to: liftAttributes.to,
      date: liftAttributes.date,
      price: liftAttributes.price,
      userId: user._id,
    });

    if (liftIdentical) {
      return {
        liftExists: true,
        _id: liftIdentical._id
      };
    }

    var liftId = Lifts.insert(lift);

    return {
      _id: liftId
    };
  }
});
