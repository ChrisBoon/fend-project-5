var Map = function(elemId, options) {
    this.map = null;
    this.elemId = elemId;
    this.options = options;
};

Map.prototype.render = function() {
  map = new google.maps.Map(this.elemId, this.options);
};

var myMap = new Map(document.getElementById('map'),{
    center: {lat: 40.7202, lng: -74.0453},
    zoom: 15
  });