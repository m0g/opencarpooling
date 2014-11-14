Template.liftsSearch.rendered = function() {
};

Template.liftsSearch.helpers({
  lifts: function() {
    var lifts = Meteor.subscribe('lifts', this.searchQuery);
    console.log(lifts);
    return lifts;
  }
});
