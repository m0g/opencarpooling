LiftForm = ReactMeteor.createClass({
  getMeteorState: function() {
    return { lift: {
      date: '',
      time: ''
    } };
  },

  handleSubmit: function(e) {
    e.preventDefault();

    console.log('state', this.state);
  },

  updateForm: function(data) {
    //console.log('update form', data);
    var lift = this.state.lift;
    //console.log('before', lift);

    Object.keys(data).forEach(function(key) {
      if (data[key])
        lift[key] = data[key];
    });
    //console.log('after', lift);

    this.setState({ lift: lift });
    //console.log('state', this.state);
  },

  render: function() {
    return (
      <form className="main form lift col-md-4" onSubmit={this.handleSubmit}>
        <h1>Offer a lift</h1>

        <InputLocation id="from" placeholder="From" input={this.props.lift.from}/>
        <InputLocation id="to" placeholder="To" input={this.props.lift.to}/>

        <InputDate id="date" placeholder="Date"
          value={this.state.lift.date}
          onChange={this.updateForm} />

        <InputTime id="time" placeholder="Time"
          value={this.state.lift.time}
          onChange={this.updateForm} />

        <div id="duration"></div>
        <div id="distance"></div>

        <div className="form-group">
          <input type="submit" value="Submit"
                 className="btn btn-primary btn-raised btn-material-deep-purple"/>
        </div>
      </form>
    );
  }
});
