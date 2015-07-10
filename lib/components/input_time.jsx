InputTime = ReactMeteor.createClass({
  componentDidMount: function() {
    var time = React.findDOMNode(this.refs.time);

    console.log('in time', this.state);

    $(time).clockpicker({
      autoclose: true,
      afterDone: function() {
        console.log('after done');
      }
    });
  },

  handleChange: function(e) {
    console.log('incoming', e);
  },

  handleInput: function(e) {
    console.log('incoming input', e);
  },

  render: function() {
    return (
      <div className="input-group clockpicker">
        <input type="text" name="time" ref="time"
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          onInput={this.handleInput}
          className="form-control input-lg changing" />

        <span className="input-group-addon">
          <span className="glyphicon glyphicon-time"></span>
        </span>
      </div>
    );
  }
});
