angular.module('starter.services', [])

.factory('Chats', function($http) {

  return {
    all: function() {
      var url = 'https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=5127&format=json';

      return $http.get(url).then((response) => {

        console.log(response.data);
        console.log(response.data.results);

        return response.data.results;

      }).catch(function(response){
        // console.log(response);
      });

      // return busses;

    },
    remove: function(bus) {
      busses.splice(busses.indexOf(bus), 1);
    },
    get: function(busId) {
      for (var i = 0; i < busses.length; i++) {
        // if (busses[i].id === parseInt(busId)) {
          return busses[i];
        // }
      }
      return null;
    }
  };
});
