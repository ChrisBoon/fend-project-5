// My list of places
//// Eventually move to an AJAX call
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



//function to remove all spaces and turn a string to lower case:
var simplifyTitle = function(str){
  return str.toLowerCase().replace(/\s+/g, '');
};



// app viewModel
var ViewModel = function(){

  // create alias for easy referencing:
  var self = this;

  // set up variable that the map will be stored on:
  var map = null;

  // Set up an observable array for storing each place observable:
  this.allPlaces = ko.observableArray([]);

  // filter is bound to the search input.
  //// On load we have an empty string.
  this.searchFor = ko.observable("");

  // Reusable function used to turn each place in my JSON to a knockout observable
  this.aPlace = function(data) {
    this.title = ko.observable(data.title);
  };

  this.update = function(){
    // function for filtering markers and list items based on search field
    this.filteredItems = ko.computed(function() {
      var filter = simplifyTitle(self.searchFor());
      // if search field is empty:
      if (!filter) {
        //for each item in this.allPlaces:
        return ko.utils.arrayFilter(self.allPlaces(), function(item) {
          //make marker visible
          item.marker.setVisible(true);
          // keep in list
          return true;
        });
      }
      // if search field is NOT empty, for each item in this.allPlaces:
      return ko.utils.arrayFilter(self.allPlaces(), function(item) {
        // get the title and see if it is in the string:
        if (simplifyTitle( item.title()).indexOf(filter) > -1) {
          // If it is we make Marker visible and keep in list
          item.marker.setVisible(true);
          return true;
        } else {
          //if it is NOT we make Marker invisible and remove name from list
          item.marker.setVisible(false);
          return false;
        }
      });

    });

  };

  // function to create the map:
  this.createMap = function(){
    self.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: {lat: 40.7202, lng: -74.0453}
    });
  };

  this.createList = function(){
    // function to take JSON places and add as observables into this.allPlaces observable array
    model.myPlaces.forEach(function(thisPlace){
      self.allPlaces.push( new self.aPlace(thisPlace));
    });
    // function to run through the this.allPlaces observable array and create a Map Marker for each one
    self.allPlaces().forEach(function(myItem,i){
      var marker = new google.maps.Marker({
        position: {lat: model.myPlaces[i].lat, lng: model.myPlaces[i].lng},
        map: self.map,
        title: model.myPlaces[i].title
      });
      myItem.marker = marker;
    });

  };

  this.init = function(){
    self.createMap();
    self.createList();
    self.update();

  };
  //call init
  this.init();
};

var initApp = function(){
  // applying bindings after map is initiated as we use Map API functions in the Knockout code
  ko.applyBindings(new ViewModel());
};

//foursquare testing:

var CLIENT_ID = 'MNLX5UCWNCVOONDL1JUOVCPPTJD1V4UTATUBYCEL5VACWBC3';
var CLIENT_SECRET = 'GMKFEK4K1GT34QW1D1YVLRBWDK0KJRG3JT5VT14G4HIS10FN';
var venueId = '54fb1694498e727051f154cc';
var API_ENDPOINT = 'https://api.foursquare.com/v2/venues/' + venueId + '?&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20160529';
$.getJSON(API_ENDPOINT, function(result, status) {


    console.log(status);
    console.log(result.response.venue.name);
});