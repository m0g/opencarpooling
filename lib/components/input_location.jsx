InputLocation = ReactMeteor.createClass({
  getMeteorState: function() {
    return {
      value: '',
      lat: 0,
      lng: 0,
    }
  },

  componentDidMount: function() {
    var input = React.findDOMNode(this.refs.input);
    console.log('input', input);

    Meteor.typeahead(input, function(query, callback) {
      if (query.length < 4) return [];

      Meteor.call('citySearch', query, function(err, res) {
        console.log(res);
        //fromLat.value = res[0].lat;
        //fromLng.value = res[0].lng;

        //callback(res);
      });
    });
  },

  render: function() {
    return (
      <div className="input-group">
        <input className="form-control input-lg changing" name={this.props.id} type="text"
           placeholder={this.props.placeholder} id={this.props.id}
           spellcheck="off" ref="input"
           data-source="geocode"/>

        <span className="input-group-addon">
          <i className="fa fa-map-marker"></i>
        </span>

        <i className="fa fa-spinner fa-spin"></i>
      </div>
    );
  }
});
