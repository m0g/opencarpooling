LiftForm = ReactMeteor.createClass({
  render: function() {
    return (
      <form className="main form lift col-md-4">
        <h1>Offer a lift</h1>
        <InputLocation id="from" placeholder="From"/>
        <InputLocation id="to" placeholder="To"/>
      </form>
    );
  }
});
