InputLocation = ReactMeteor.createClass({
  render: function() {
    return (
      <div className="input-group">
        <input className="form-control input-lg changing" name={this.props.id} type="text"
           placeholder={this.props.placeholder} id={this.props.id}
           autocomplete="off" spellcheck="off"
           data-source="geocode"/>

        <span className="input-group-addon">
          <i className="fa fa-map-marker"></i>
        </span>

        <i class="fa fa-spinner fa-spin"></i>
      </div>
    );
  }
});
