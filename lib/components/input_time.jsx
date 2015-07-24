InputTime = ReactMeteor.createClass({
  getMeteorState: function() {
    console.log('init');
    return { value: this.props.value };
  },

  componentDidMount: function() {
    var time = React.findDOMNode(this.refs.time);
    var self = this;

    $(time).pickatime({
      onClose: self.handleChange
    });
  },

  componentWillReceiveProps: function(nextProps) {
    console.log('next', nextProps);
    if (nextProps.value.length > 0)
      this.setState({ value: nextProps.value });
  },

  handleChange: function() {
    var time = React.findDOMNode(this.refs.time);
    console.log('time on close', time.value.trim());

    if (time.value.trim()) {
      this.setState({ value: time.value.trim() });
      this.props.onChange({ time: time.value.trim() })
    }
  },

  render: function() {
    console.log('props', this.props);
    return (
      <div className="input-group clockpicker">
        <input type="text" name="time" ref="time"
          placeholder={this.props.placeholder}
          value={this.state.value}
          className="form-control input-lg changing" />

        <span className="input-group-addon">
          <span className="glyphicon glyphicon-time"></span>
        </span>
      </div>
    );
  }
});
