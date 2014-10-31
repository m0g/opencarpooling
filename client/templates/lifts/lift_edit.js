Template.liftEdit.events({
  'submit form': function(e) {
    e.preventDefault();

    var currentLiftId = this._id;

    var liftProperties = {
      from: $(e.target).find('[name=from]').val(),
      to: $(e.target).find('[name=to]').val(),
      date: $(e.target).find('[name=date]').val(),
      price: $(e.target).find('[name=price]').val()
    }

    Lifts.update(currentLiftId, {$set: liftProperties}, function(error) {
      if (error) {
        // display the error to the user
        alert(error.reason);
      } else {
        Router.go('liftPage', {_id: currentPostId});
      }
    });
  },

  'click .delete': function(e) {
    e.preventDefault();

    if (confirm("Delete this post?")) {
      var currentLiftId = this._id;
      Lifts.remove(currentLiftId);
      Router.go('liftsList');
    }
  }
});
