Template.userSubmit.events({
  'submit form': function(e) {
    Meteor.call('sendMail');
  }
});
