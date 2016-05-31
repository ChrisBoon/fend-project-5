var CLIENT_ID = 'MNLX5UCWNCVOONDL1JUOVCPPTJD1V4UTATUBYCEL5VACWBC3';
var CLIENT_SECRET = 'GMKFEK4K1GT34QW1D1YVLRBWDK0KJRG3JT5VT14G4HIS10FN';

// My list of places
//// Eventually move to an AJAX call
var model = {
  myPlaces: [
    {
      "title": "Pasta Dal Cuore",
      "lat": 40.721061,
      "lng": -74.046622,
      "tags": ["restaurant", "italian", "takeout", "byob"],
      "specialty": "Freshly made pasta",
      "foursquare": "545d4fcd498e167b11481c30"
    },
    {
      "title": "Prato Bakery",
      "lat": 40.723577,
      "lng": -74.044205,
      "tags": ["bakery", "coffee shop", "italian", "takeout"],
      "specialty": "Cantuccini",
      "foursquare": "54fb1694498e727051f154cc"
    },
    {
      "title": "Brownstone Diner & Pancake Factory",
      "lat": 40.716721,
      "lng": -74.048564,
      "tags": ["restaurant", "diner", "american"],
      "specialty": "Pancakes",
      "foursquare": "4b0ec3c7f964a520b25a23e3"
    },
    {
      "title": "Taqueria Downtown",
      "lat": 40.716275,
      "lng": -74.044635,
      "tags": ["restaurant", "mexican", "takeout"],
      "specialty": "Tacos",
      "foursquare": "49d78123f964a5202c5d1fe3"
    },
    {
      "title": "New York Bagel Cafe and Deli",
      "lat": 40.721898,
      "lng": -74.047104,
      "tags": ["diner", "american", "takeout"],
      "specialty": "Bagels",
      "foursquare": "4f900989e4b0324e976f087b"
    },
    {
      "title": "Two Boots Pizza Jersey City",
      "lat": 40.720154,
      "lng": -74.043624,
      "tags": ["restaurant", "italian", "takeout", "pizza"],
      "specialty": "Pizza",
      "foursquare": "4f4287ecc2ee912d136a3b50"
    },
    {
      "title": "Porta",
      "lat": 40.720205,
      "lng": -74.043702,
      "tags": ["restaurant", "italian", "pizza"],
      "specialty": "Pizza",
      "foursquare": "54764818498e156b22125771"
    },
    {
      "title": "ME Casa",
      "lat": 40.720911,
      "lng": -74.048153,
      "tags": ["restaurant", "takeout", "puerto-rican", "byob"],
      "specialty": "Pernil Asado and Mofongo",
      "foursquare": "4fb82303e4b00fea2b7dde56"
    },
    {
      "title": "Cafe Batata",
      "lat": 40.723184,
      "lng": -74.050460,
      "tags": ["restaurant", "mexican", "takeout"],
      "specialty": "Batata",
      "foursquare": "56a8e74c498efbea47c86247"
    },
    {
      "title": "Razza",
      "lat": 40.717752,
      "lng": -74.044254,
      "tags": ["restaurant", "italian", "pizza"],
      "specialty": "Pizza",
      "foursquare": "5070e64ee4b07e6d88738ffb"
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
  var map;
  var infowindow;
  var selectedPlace = false;
  this.selectedLocation = ko.observable("");
  this.selectedName = ko.observable("");


  // Set up an observable array for storing each place observable:
  this.allPlaces = ko.observableArray([]);

  // filter is bound to the search input.
  //// On load we have an empty string.
  this.searchFor = ko.observable("");

  // Reusable function used to turn each place in my JSON to a knockout observable
  this.aPlace = function(data) {
    this.title = ko.observable(data.title);
    this.active = ko.observable("");
    this.foursquare = data.foursquare;
  };

  this.update = function(){
    var deferred = $.Deferred();
    // function for filtering markers and list items based on search field
    this.filteredItems = ko.computed(function() {
      var filter = simplifyTitle(self.searchFor());
      // if search field is empty:
      if (!filter) {
        //for each item in this.allPlaces:
        return ko.utils.arrayFilter(self.allPlaces(), function(item) {
          //make marker visible
          if (item.marker) {
            item.marker.setVisible(true);
          }
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
    return deferred.promise();

  };


  this.showData = function(data){
    if (self.selectedLocation.marker) {
      self.closeLocation();
    }
    self.selectedLocation = data;
    self.selectedName(data.title());

    console.log(self.selectedName());
    //get the itrms foursquare ID:
    var venueId = self.selectedLocation.foursquare;
    //ajax it
    var API_ENDPOINT = 'https://api.foursquare.com/v2/venues/' + venueId + '?&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20160529';
    var jqxhr = $.getJSON(API_ENDPOINT, function(result, status) {
      console.log( status );
      self.selectedPlace = result.response.venue;
    })
    .done( function(){
      self.infowindow.setContent(self.selectedLocation.title());
      self.infowindow.open(self.map, self.selectedLocation.marker);
      self.selectedLocation.marker.setAnimation(google.maps.Animation.BOUNCE);
      self.selectedLocation.active = true;
    })
    .fail( function(){
      console.log("PROBABLY ADD ERROR HANDLING HERE");
    });
  };

  this.triggerPlaceFromList = function(data){
    self.showData(data);
    console.log(self.selectedName());
  };

  // function to create the map:
  this.createMap = function(){
    var deferred = $.Deferred();
    self.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: {lat: 40.7202, lng: -74.0453}
    });
    self.infowindow = new google.maps.InfoWindow({

    });
    google.maps.event.addListener(self.infowindow, 'closeclick',function(){
      self.closeLocation();
    });

    return deferred.promise();
  };

  this.createList = function(){
    var deferred = $.Deferred();
    // function to take JSON places and add as observables into this.allPlaces observable array
    model.myPlaces.forEach(function(thisPlace){
      self.allPlaces.push( new self.aPlace(thisPlace));
    });
    // function to run through the this.allPlaces observable array and create a Map Marker for each one


    return deferred.promise();
  };

  this.createMarkers = function(){
    var deferred = $.Deferred();

    self.allPlaces().forEach(function(myItem,i){
      addMarkerWithTimeout(myItem,i, i * 150);
    });

    function addMarkerWithTimeout(myItem, i, timeout){
      window.setTimeout(function() {
        var marker = new google.maps.Marker({
          position: {lat: model.myPlaces[i].lat, lng: model.myPlaces[i].lng},
          animation: google.maps.Animation.DROP,
          map: self.map,
          title: model.myPlaces[i].title
        });

        // adding event listener when making markers:
        marker.addListener('click', function() {
          self.showData(myItem);
        });
        myItem.marker = marker;
      }, timeout);
    }

    return deferred.promise();
  };

  this.closeLocation = function(){
    self.selectedLocation.marker.setAnimation(null);
  };

  this.init = function(){
    var d = jQuery.Deferred(),
    p=d.promise();
    p.then(
      self.createMap()
    ).then(
      self.createList()
    ).then(
      self.update()
    ).then(
      self.createMarkers()
    );
    d.resolve();
  };

  //call init
  this.init();
};

var initApp = function(){
  // applying bindings after map is initiated as we use Map API functions in the Knockout code
  ko.applyBindings(new ViewModel());
};

//foursquare testing:


