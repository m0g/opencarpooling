LiftSubmit = ReactMeteor.createClass({
  // Make sure your component implements this method.
  getMeteorState: function() {
    return { lift: {
      from: {
        value: '',
        lat: 0,
        lng: 0,
      },

      to: {
        value: '',
        lat: 0,
        lng: 0,
      },

      date: null,
      price: 0,
      seats: 0,
      info: ''
    }};
  },

  render: function() {
    return (
      <div>
        <LiftForm lift={this.state.lift}/>
        <LiftMap />
      </div>
    );
  }
});
