LiftSubmit = ReactMeteor.createClass({
  // Make sure your component implements this method.
  getMeteorState: function() {
    return { lift: {
      from: '',
      to: '',
      date: null,
      price: 0,
      seats: 0,
      info: ''
    }};
  },

  render: function() {
    return (
      <div>
        <LiftForm />
        <LiftMap />
      </div>
    );
  }
});
