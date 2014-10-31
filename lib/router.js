Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound',
  waitOn: function() {
    return Meteor.subscribe('lifts');
  }
});

Router.route('/', { name: 'liftsList' });

Router.route('/lifts/:_id', {
  name: 'liftPage',
  data: function() {
    return Lifts.findOne(this.params._id);
  }
});

Router.route('/lifts/:_id/edit', {
  name: 'liftEdit',
  data: function() { 
    return Lifts.findOne(this.params._id);
  }
});

Router.route('/submit', {name: 'liftSubmit'});

var requireLogin = function() {
  if (! Meteor.user()) {
    if (Meteor.loggingIn()) {
      this.render(this.loadingTemplate);
    } else {
      this.render('accessDenied');
    }
  } else {
    this.next();
  }
}

Router.onBeforeAction('dataNotFound', {
  only: 'liftPage'
});

Router.onBeforeAction(requireLogin, {only: 'liftSubmit'});
