InputDate = ReactMeteor.createClass({
  getMeteorState: function() {
    console.log('init', this.state);
    return { value: this.props.value };
  },

  componentDidMount: function() {
    var date = React.findDOMNode(this.refs.date);
    var self = this;

    $(date).pickadate({
      format: 'dd/mm/yyyy',
      onClose: function() {
      }
    })
  },

  //componentWillReceiveProps: function(nextProps) {
  //  console.log('next', nextProps);
  //  if (nextProps.value.length > 0) {
  //    console.log('updating', nextProps.value);
  //    this.setState({ value: nextProps.value });
  //  }
  //},

  handleChange: function() {
    var date = React.findDOMNode(this.refs.date);

    console.log('date on close');
    if (date.value.trim()) {
      this.setState({ value: time.value.trim() });
      self.props.onChange({ date: this.state.value })
    }
  },

  render: function() {
    return (
      <div className="input-group">
        <input name="date" ref="date" type="text" readOnly
          value={this.props.value}
          placeholder={this.props.placeholder}
          className="form-control input-lg changing"/>

        <span className="input-group-addon">
          <i className="fa fa-calendar"></i>
        </span>
      </div>
    );
  }
});
