InputDate = ReactMeteor.createClass({
  componentDidMount: function() {
    var date = React.findDOMNode(this.refs.date);

    $(date).datepicker({
      startDate: '0',
      endDate: '+2m',
      format: 'dd/mm/yyyy'
    });
  },

  render: function() {
    return (
      <div className="input-group">
        <input name="date" ref="date" type="text" value=""
          placeholder={this.props.placeholder}
          className="form-control input-lg changing"/>

        <span className="input-group-addon">
          <i className="fa fa-calendar"></i>
        </span>
      </div>
    );
  }
});
