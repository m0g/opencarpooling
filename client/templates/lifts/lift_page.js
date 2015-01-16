Template.liftPage.rendered = function() {
  map = new Mapping('lift-map', { polyline: true });

  map.mapDirection(
    this.data.fromLoc[0], this.data.fromLoc[1], 
    this.data.toLoc[0], this.data.toLoc[1]
  );
  console.log(this.data);
}
