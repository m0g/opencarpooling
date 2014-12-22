Template.header.events({
  'click #submit-link': function(e) {
    e.preventDefault();
    Router.go('/submit');
    //Bender.go('/submit', {}, { animation: 'slideLeft' });
  }
});
