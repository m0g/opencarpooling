LiftMap = ReactMeteor.createClass({
  componentDidMount: function() {
    map = new Mapping(this.getDOMNode(), { deactivateZoom: true, polyline: true });
    map.setAsBackground();
  },

  // Make sure your component implements this method.
  render: function() {
    return (
      <div id="form-map" className="col-md-8"></div>
    );
  }
});
