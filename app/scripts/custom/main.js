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

var map;

function initMap() {
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 15,
    center: {lat: 40.7202, lng: -74.0453}
  });
  ko.applyBindings(new ViewModel());
}

var aPlace = function(data) {
  this.title = ko.observable(data.title);
};


var ViewModel = function(){
  var self = this;

  this.allPlaces = ko.observableArray([]);

  this.filter = ko.observable("");

  model.myPlaces.forEach(function(thisPlace){
    self.allPlaces.push( new aPlace(thisPlace));
  });

  this.allPlaces().forEach(function(myItem,i){
    var marker = new google.maps.Marker({
      position: {lat: model.myPlaces[i].lat, lng: model.myPlaces[i].lng},
      map: map,
      title: model.myPlaces[i].title
    });
    myItem.marker = marker;
  });


  this.filteredItems = ko.computed(function() {
    var filter = this.filter().toLowerCase();
    if (!filter) {
      return ko.utils.arrayFilter(this.allPlaces(), function(item) {
          item.marker.setVisible(true);
              return true;
      });
    }

    return ko.utils.arrayFilter(this.allPlaces(), function(item) {
      if (item.title().toLowerCase().indexOf(filter) > -1) {
        item.marker.setVisible(true);
        return true;
      } else {
        item.marker.setVisible(false);
        return false;
      }
    });

  }, this);


};

