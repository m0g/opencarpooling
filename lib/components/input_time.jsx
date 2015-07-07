InputTime = ReactMeteor.createClass({
  componentDidMount: function() {
    var time = React.findDOMNode(this.refs[this.props.ref]);

    $(time).clockpicker({
      autoclose: true,
      beforeDone: LiftLocal.store
    });
  },

  render: function() {
    return (
      <div className="input-group clockpicker">
        <input type="text" name="time" ref={this.props.ref}
          placeholder={this.props.placeholder}
          className="form-control input-lg changing" />

        <span className="input-group-addon">
          <span className="glyphicon glyphicon-time"></span>
        </span>
      </div>
    );
  }
});
