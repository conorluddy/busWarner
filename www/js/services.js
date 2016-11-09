angular.module('starter.services', [])

.factory('Busses', function($http) {

  return {
    all: function() {
      var url = 'https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=5127&routeid=145&format=json';
      return $http.get(url).then((response) => {
        console.log(response.data);
        console.log(response.data.results);

        return response.data.results;

      }).catch(function(response){
        // console.log(response);
      });
      // return busses;
    },
    get: function(routeId, stopId) {
      var url = 'https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid='+stopId+'&routeid='+routeId+'&format=json';
      return $http.get(url).then((response) => {
        console.log(response.data);
        console.log(response.data.results);

        return response.data.results;

      }).catch(function(response){
        // console.log(response);
      });
      // return busses;
    }
  };
})




.factory('Stops', function($http) {

  return {
    get: function() {
      var url = 'https://data.dublinked.ie/cgi-bin/rtpi/busstopinformation?&format=json';

      return $http.get(url).then((response) => {
        console.log(response);
        return response.data.results;
      }).catch(function(errResponse){
        console.log(errResponse);
      });
    }
    // get: function(busId) {
      // for (var i = 0; i < busses.length; i++) {
      //   // if (busses[i].id === parseInt(busId)) {
      //     return busses[i];
      //   // }
      // }
      // return null;
    // }
  };
});
