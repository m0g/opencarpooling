Router.configure({
  layoutTemplate: 'layout',
  loadingTemplate: 'loading',
  notFoundTemplate: 'notFound'
});

Router.route('/', { 
  name: 'liftsList',
  waitOn: function() {
    return Meteor.subscribe('latestLifts');
  }
});

Router.route('/lifts/search/:from-:to-:when', {
  name: 'liftsSearch',
  data: function() {
    return { searchQuery: this.params };
  },
  waitOn: function() {
    var from = this.params.from
      , to = this.params.to
      , when = this.params.when;

    return Meteor.subscribe('liftsSearch', from, to, when);
  }
});

Router.route('/lifts/:_id', {
  name: 'liftPage',
  waitOn: function() {
    return Meteor.subscribe('lifts');
  },
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

Router.route('/activatelift/:token', { 
  name: 'liftActivate',
  data: function() {
    return { token: this.params.token }
  }
});

Router.route('/submit', {name: 'liftSubmit'});

Router.route('/lifts/:_id/user/submit', {
  name: 'userSubmit',
  data: function() {
    console.log('params', this.params._id);
    return { liftId: this.params._id };
  }
});

Router.onBeforeAction('dataNotFound', {
  only: 'liftPage'
});

