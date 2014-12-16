Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/', { 
  name: 'liftsList',
  waitOn: function() {
    return Meteor.subscribe('lifts');
  }
});

Router.route('/lifts/search/:from-:to-:when', {
  name: 'liftsSearch',
  waitOn: function() {
    var from = this.params.from
      , to = this.params.to
      , when = this.params.when;

    return Meteor.subscribe('liftsSearch', from, to, when);
  }
});

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
