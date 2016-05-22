var model = {
  myPlaces: [
    {
      "title": "Pasta Dal Cuore",
      "lat": 40.721061,
      "lng": -74.046622,
      "tags": ["restaurant", "italian", "takeout", "byob"],
      "specialty": "Freshly made pasta"
    },
    {
      "title": "Prato Bakery",
      "lat": 40.723577,
      "lng": -74.044205,
      "tags": ["bakery", "coffee shop", "italian", "takeout"],
      "specialty": "Cantuccini"
    },
    {
      "title": "Brownstone Diner & Pancake Factory",
      "lat": 40.716721,
      "lng": -74.048564,
      "tags": ["restaurant", "diner", "american"],
      "specialty": "Pancakes"
    },
    {
      "title": "Taqueria Downtown",
      "lat": 40.716275,
      "lng": -74.044635,
      "tags": ["restaurant", "mexican", "takeout"],
      "specialty": "Tacos"
    },
    {
      "title": "New York Bagel Cafe and Deli",
      "lat": 40.721898,
      "lng": -74.047104,
      "tags": ["diner", "american", "takeout"],
      "specialty": "Bagels"
    },
    {
      "title": "Two Boots Pizza Jersey City",
      "lat": 40.720154,
      "lng": -74.043624,
      "tags": ["restaurant", "italian", "takeout", "pizza"],
      "specialty": "Pizza"
    },
    {
      "title": "Porta",
      "lat": 40.720205,
      "lng": -74.043702,
      "tags": ["restaurant", "italian", "pizza"],
      "specialty": "Pizza"
    },
    {
      "title": "ME Casa",
      "lat": 40.720911,
      "lng": -74.048153,
      "tags": ["restaurant", "takeout", "puerto-rican", "byob"],
      "specialty": "Pernil Asado and Mofongo"
    },
    {
      "title": "Cafe Batata",
      "lat": 40.723184,
      "lng": -74.050460,
      "tags": ["restaurant", "mexican", "takeout"],
      "specialty": "Batata"
    },
    {
      "title": "Razza",
      "lat": 40.717752,
      "lng": -74.044254,
      "tags": ["restaurant", "italian", "pizza"],
      "specialty": "Pizza"
    }


  ]
};

var Map = function(elemId, elemLat, elemlng) {
  this.map = null;
  this.elemId = elemId;
  this.testID = "ChIJYY8P-LBQwokRDC9_6cTfrW8";
  this.styles = [
    {
      "featureType": "poi.business",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "water",
      "stylers": [
        { "color": "#5c7d85" }
      ]
    },{
      "featureType": "road",
      "elementType": "geometry.fill",
      "stylers": [
        { "visibility": "on" },
        { "saturation": 100 },
        { "lightness": -37 },
        { "hue": "#0077ff" },
        { "color": "#c8d5e3" }
      ]
    },{
      "featureType": "landscape.man_made",
      "stylers": [
        { "hue": "#ff00d4" },
        { "gamma": 9.99 }
      ]
    },{
      "featureType": "road",
      "elementType": "geometry.stroke",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "elementType": "labels",
      "stylers": [
        { "visibility": "off" }
      ]
    },{
      "featureType": "poi.park",
      "elementType": "geometry",
      "stylers": [
        { "visibility": "on" },
        { "color": "#d8e0d3" }
      ]
    }
  ];
  this.options = {
    center: {lat: elemLat, lng: elemlng},
    zoom: 15,
    styles: this.styles
  };

};

Map.prototype.render = function() {
  this.map = new google.maps.Map(this.elemId, this.options);
  this.markers();
};

Map.prototype.markers = function(){
  for (var i = model.myPlaces.length - 1; i >= 0; i--) {
    var marker = new google.maps.Marker({
      position: {lat: model.myPlaces[i].lat, lng: model.myPlaces[i].lng},
      map: this.map,
      title: model.myPlaces[i].title
    });
  }
};

var myMap = new Map(document.getElementById('map'), 40.7202, -74.0453);