var CLIENT_ID = 'MNLX5UCWNCVOONDL1JUOVCPPTJD1V4UTATUBYCEL5VACWBC3';
var CLIENT_SECRET = 'GMKFEK4K1GT34QW1D1YVLRBWDK0KJRG3JT5VT14G4HIS10FN';

// My list of places
//// Eventually move to an AJAX call
var model = {
  myPlaces: [
    {
      "title": "Prato Bakery",
      "lat": 40.723577,
      "lng": -74.044205,
      "foursquare": "54fb1694498e727051f154cc"
    },
    {
      "title": "Brownstone Diner & Pancake Factory",
      "lat": 40.716721,
      "lng": -74.048564,
      "foursquare": "4b0ec3c7f964a520b25a23e3"
    },
    {
      "title": "Taqueria Downtown",
      "lat": 40.716275,
      "lng": -74.044635,
      "foursquare": "49d78123f964a5202c5d1fe3"
    },
    {
      "title": "Two Boots Jersey City",
      "lat": 40.720154,
      "lng": -74.043624,
      "foursquare": "4f4287ecc2ee912d136a3b50"
    },
    {
      "title": "Porta",
      "lat": 40.720205,
      "lng": -74.043702,
      "foursquare": "54764818498e156b22125771"
    },
    {
      "title": "Me Casa",
      "lat": 40.720911,
      "lng": -74.048153,
      "foursquare": "4fb82303e4b00fea2b7dde56"
    },
    {
      "title": "Cafe Batata",
      "lat": 40.723184,
      "lng": -74.050460,
      "foursquare": "56a8e74c498efbea47c86247"
    },
    {
      "title": "Razza",
      "lat": 40.717752,
      "lng": -74.044254,
      "foursquare": "5070e64ee4b07e6d88738ffb"
    },
    {
      "title": "I throw an error",
      "lat": 40.715,
      "lng": -74.038,
      "foursquare": "notAValidID"
    }
  ]
};

var mapStyles = [{"elementType":"labels","stylers":[{"visibility":"off"}]},{"elementType":"geometry","stylers":[{"visibility":"off"}]},{"featureType":"road","elementType":"geometry","stylers":[{"visibility":"on"},{"color":"#000000"}]},{"featureType":"landscape","stylers":[{"color":"#ffffff"},{"visibility":"on"}]},{}];


// Function to remove all spaces and turn a string to lower case:
var simplifyTitle = function(str){
  return str.toLowerCase().replace(/\s+/g, '');
};


// app viewModel
var ViewModel = function(){

  // Create alias for easy referencing:
  var self = this;

  // Set up variables that the map and infowindow will be stored on:
  var map;
  var infowindow;

  // Keep a reference to all markers so fitBounds can be calculated
  this.markers = ko.observableArray([]);
  var markerBounds;

  // We will store current foursquare data to selectedPlace variable:
  this.selectedPlace = ko.observable(false);

  // We will use an observable to track which of the current locations is being interacted with:
  this.selectedLocation = ko.observable("");

  // Building the map markers requires the initial data to be read.
  // On the unlikely chance the map is ready to build before knockout has parsed the list data
  // I am storing a deferred which the list init will resolve.
  // The map will not init until the deferred has resolved
  this.dataReady = jQuery.Deferred();

  // Set up an observable array for storing each place observable:
  this.allPlaces = ko.observableArray([]);

  // Filter is bound to the search input.
  //// On load we have an empty string.
  this.searchFor = ko.observable("");

  // If the foursqaure data call throws any erros we pass text to here. The text then displays in the app to tell the user:
  this.error = ko.observable(false);
  // We store a variable here for assigning a timeout to so it can easily be set in one function and cancelled in another:
  var mapCheck;
  // In initList we set a timeout on mapCheck for 4s and if maps hasn't loaded we turn this to true.
  // In the html we bind a message to this to display only if true.
  // The message readssaying 'Google Maps is taking longer to load then expected. Keep waiting or try again later.'
  // We also check this is false before trying to do any map interactions.
  // This way if the map fails, the rest of the fuctionality still works so users can still see the Foursquare data.
  this.mapFail = ko.observable(false);

  this.showApp = ko.observable(false);

  // Reusable function used to turn each place in my JSON to a knockout observable
  this.aPlace = function(data) {
    this.title = ko.observable(data.title);
    this.foursquare = data.foursquare;
  };

  // Function to set selected item as currently viewed one
  // called by clicking a marker or list item
  this.showData = function(data){
    // If a location is already open we close it:
    if (self.selectedLocation()) {
      if( !self.mapFail ){
        self.selectedLocation().marker.setAnimation(null);
      }
    }
    // We set this location as open:
    self.selectedLocation(data);

    //get the items foursquare ID:
    var venueId = self.selectedLocation().foursquare;
    //ajax it:
    var API_ENDPOINT = 'https://api.foursquare.com/v2/venues/' + venueId + '?&client_id=' + CLIENT_ID + '&client_secret=' + CLIENT_SECRET + '&v=20160529';
    var request = $.ajax({
      dataType: "json",
      url: API_ENDPOINT,
      timeout: 2000,
      success: function(response) {
        self.selectedPlace(response.response.venue);
      }
    }).done( function(response){
      self.error(false);
      //center map on selected place:
      if( !self.mapFail ){
        self.map.panTo(self.selectedLocation().marker.getPosition());
        //add the selected places title to infowindow, show it, and bounce the marker:
        self.infowindow.setContent(self.selectedLocation().title());
        self.infowindow.open(self.map, self.selectedLocation().marker);
        self.selectedLocation().marker.setAnimation(google.maps.Animation.BOUNCE);
      }
    })
    .fail( function( xhr, status ) {
      self.closeLocation();
      if( !self.mapFail ){
        self.infowindow.close();
      }

      if( status == "timeout" ) {
          self.error("Foursquare could not be reached right now.");
      }
      if( status == "error" ) {
          self.error("Sorry, there was a problem getting data for this location.");
      }
    });

  };

  // Function triggered when user clicks on a list item:
  this.triggerPlaceFromList = function(data){
    self.showData(data);

  };

  // Function to remove any active location:
  this.closeLocation = function(){
    if( !self.mapFail ){
      self.selectedLocation().marker.setAnimation(null);
    }
    self.selectedLocation(null);
    self.selectedPlace(false);
  };

  // function to take JSON places and add as observables into this.allPlaces observable array
  // called by self.initList()
  this.createListObservable = function(){
    model.myPlaces.forEach(function(thisPlace){
      self.allPlaces.push( new self.aPlace(thisPlace));
    });
    this.filteredItems = self.allPlaces;
  };

  // Function called on load to allow user to filter list by typing in input:
  this.initFilter = function(){
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
          if (item.marker) {
            item.marker.setVisible(true);
          }
          return true;
        } else {
          //if it is NOT we make Marker invisible and remove name from list
          if (item.marker) {
            item.marker.setVisible(false);
          }
          return false;
        }
      });

    });

  };

  // function to create the map:
  // called by self.initMap()
  this.createMap = function(){

    self.map = new google.maps.Map(document.getElementById('map'), {
      zoom: 15,
      center: {lat: 40.7202, lng: -74.0453},
      styles: mapStyles
    });
    self.infowindow = new google.maps.InfoWindow({});
    self.markerBounds = new google.maps.LatLngBounds();

    google.maps.event.addListener(self.infowindow, 'closeclick',function(){
      self.closeLocation();
    });

  };

  // Function to create map markers from observable array of places.
  // called by self.initMap()
  this.createMarkers = function(){

    // Loop through each array item:
    self.allPlaces().forEach(function(myItem,i){
      var marker = new google.maps.Marker({
        position: {lat: model.myPlaces[i].lat, lng: model.myPlaces[i].lng},
        animation: google.maps.Animation.DROP,
        map: self.map,
        title: model.myPlaces[i].title
      });

      // Adding event listener when making markers:
      marker.addListener('click', function() {
        self.showData(myItem);
      });

      // Add marker to allPlaces item:
      myItem.marker = marker;
      self.markers.push(marker);
    });

  };

  // Zoom map to fit all markers:
  // called by self.initMap()
  this.fitBounds = function(){
    for( var index in self.markers()){
      var position = self.markers()[index].position;
      self.markerBounds.extend(position);
    }
    self.map.fitBounds(self.markerBounds);
  };

  // Function to init the basic list data:
  this.initList = function(){
    self.showApp(true);
    self.createListObservable();
    self.initFilter();
    // Resolve the deferred to let initMap know it is safe to create map markers:
    self.dataReady.resolve();
    // From the time we init the list we will allow the map 4 seconds before showing the error message.
    // Note the error message does suggest it could still load so if connection is slow we haven't aborted it:
    // Also the rest of the app functionality will work without the map so we don't stop the entire app:
    self.mapCheck =  setTimeout(function(){
      self.mapFail("Google Maps is taking longer to load then expected. Keep waiting or try again later.");
    }, 4000);

  };

  // Function to init the map - triggered once Google Maps JS is ready:
  this.initMap = function(){
    //stop timeout from occuring:
    clearTimeout(self.mapCheck);
    // if 'slow to load' note had appeared we can get rid of it:
    self.mapFail(false);
    // Create map straight away:
    self.createMap();
    // Wait until data is ready before dropping markers:
    self.dataReady.done(function(){
      self.createMarkers();
      self.fitBounds();
    });

  };

  //call initList as soon as bindings applied:
  this.initList();
};

// assign ViewModel to variable so it can be reached outside of scope
my = { viewModel: new ViewModel() };
ko.applyBindings(my.viewModel);

//maps API callback triggers this function once loaded:
var initApp = function(){
  // calls the function to init map content:
  my.viewModel.initMap();
};
