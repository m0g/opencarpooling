LiftForm = ReactMeteor.createClass({
  handleSubmit: function(e) {
    e.preventDefault();

    var time = React.findDOMNode(this.refs.time).value.trim();
    console.log('time', time);
  },

  render: function() {
    return (
      <form className="main form lift col-md-4" onsubmit={this.handleSubmit}>
        <h1>Offer a lift</h1>

        <InputLocation id="from" placeholder="From" input={this.props.lift.from}/>
        <InputLocation id="to" placeholder="To" input={this.props.lift.to}/>
        <InputDate id="date" placeholder="Date" input={this.props.lift.date}/>
        <InputTime id="time" placeholder="Time" input={this.props.lift.time}
          onChange={this.updateInput} />

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
