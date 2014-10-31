Template.liftsList.helpers({
  lifts: function() {
    return Lifts.find({}, {sort: {submitted: -1}});
  }
});
