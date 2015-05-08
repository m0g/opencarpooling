Template.liftActivate.helpers({
  activate: function() {
    Meteor.call('liftActivate', this.token, function(err, results) {
      if (results.hasOwnProperty('_id'))
        Router.go('liftPage', { _id: results._id });
    });
  }
});

