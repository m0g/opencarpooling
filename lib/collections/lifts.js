Lifts = new Mongo.Collection('lifts');

Lifts.attachSchema(new SimpleSchema({
  from: { type: String, label: "from", max: 200 },
  to: { type: String, label: "to", max: 200 },
  fromLoc: { type: [Number], label: "FromLoc", min: 0, decimal: true },
  toLoc: { type: [Number], label: "ToLoc", min: 0, decimal: true },
  date: { type: Date, label: "Date" },
  price: { type: Number, label: "Price", min: 0 },
}));

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
      date: Date,
      price: String
    });

    var geonames = new Geonames();

    var from = geonames.getCity(liftAttributes.from);
    var to = geonames.getCity(liftAttributes.to);

    liftAttributes.from = from.value;
    liftAttributes.to = to.value;

    var user = Meteor.user();

    console.log(from.loc);

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
