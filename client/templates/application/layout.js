Template.layout.rendered = function() {
  //Bender.initialize(this.find('#page-container'));
};

Template.layout.helpers({
  pageTitle: function() { return Session.get('pageTitle'); }
});
