InputDate = ReactMeteor.createClass({
  componentDidMount: function() {
    var date = React.findDOMNode(this.refs.date);
    var self = this;

    //$(date).datepicker({
    //  startDate: '0',
    //  endDate: '+2m',
    //  format: 'dd/mm/yyyy'
    //});
    $(date).pickadate({
      format: 'dd/mm/yyyy',
      onClose: function() {
        console.log('hi', date.value.trim());
        self.props.onChange({ date: date.value.trim() })
      }
    })
  },

  handleChange: function(e) {
    console.log('incoming', e);
  },

  render: function() {
    return (
      <div className="input-group">
        <input name="date" ref="date" type="text" value=""
          placeholder={this.props.placeholder}
          onChange={this.handleChange}
          className="form-control input-lg changing"/>

        <span className="input-group-addon">
          <i className="fa fa-calendar"></i>
        </span>
      </div>
    );
  }
});
