Template.liftItem.helpers({
  ownLift: function() {
    return this.userId === Meteor.userId();
  },
  title: function() {
    return this.from+' to '+this.to;
  }
});
