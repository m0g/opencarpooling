Template.userSubmit.events({
  'submit form': function(e) {
    e.preventDefault();

    var email = $(e.target).find('[name=email]').val();

    Meteor.call('sendActivationCode', this.liftId, email, function(err, result) {
      console.log('activation code', err, result);
      Router.go('liftPending', {_id: result.liftId});
    });
  }
});
