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
    check(liftAttributes, {
      from: String,
      to: String,
      info: String,
      date: Date,
      seats: Number,
      price: Number
    });

    var geonames = new Geonames();

    var from = Meteor.call('getCity', liftAttributes.from);
    var to = Meteor.call('getCity', liftAttributes.to);

    //if (Meteor.isClient) console.log('from', from);

    if (Meteor.isServer) {
      liftAttributes.from = from.value;
      liftAttributes.to = to.value;
    }

    var lift = _.extend(liftAttributes, {
      activated: false,
      currency: 'EUR',
      submitted: new Date()
    });

    if (Meteor.isServer)
      lift = _.extend(lift, {
        fromLoc: from.loc,
        toLoc: to.loc,
      });

    var liftIdentical = Lifts.findOne({
      from: liftAttributes.from,
      to: liftAttributes.to,
      date: liftAttributes.date,
      price: liftAttributes.price
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
