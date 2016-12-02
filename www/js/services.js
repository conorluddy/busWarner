angular.module('starter.services', [])

.factory('Busses', function($http) {

  return {
    all: function() {
      var url = 'https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid=5127&routeid=145&format=json';
      return $http.get(url).then((response) => {
        // console.log(response.data);
        // console.log(response.data.results);
        return response.data.results;
      }).catch(function(response){
        // console.log(response);
      });

    },
    get: function(routeId, stopId) {
      var url = 'https://data.dublinked.ie/cgi-bin/rtpi/realtimebusinformation?stopid='+stopId+'&routeid='+routeId+'&format=json';
      return $http.get(url).then((response) => {
        // console.log(response.data);
        // console.log(response.data.results);
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
})




// localforage.getItem('busStop').then((busStop)=>{
//   route = busRoute;
//   stop = busStop;
// })

.factory('Settings', function() {

  return {

    setInboundRoute: (inboundRoute) => {
      localforage.setItem('busRouteInbound', inboundRoute)
        .then((inboundRoute) => {
          console.log('Saving inboundRoute: ', inboundRoute);
          return inboundRoute;
        }).catch((err) => {
          console.warn(err);
        });
    },

    setInboundStop: (inboundStop) => {
      localforage.setItem('busStopInbound', inboundStop)
        .then((inboundStop) => {
          console.log('Saving inboundStop: ', inboundStop);
          return inboundStop;
        }).catch((err) => {
          console.warn(err);
        });
    },

    setOutboundRoute: (outboundRoute) => {
      localforage.setItem('busRouteOutbound', outboundRoute)
        .then((outboundRoute) => {
          console.log('Saving outboundRoute: ', outboundRoute);
          return outboundRoute;
        }).catch((err) => {
          console.warn(err);
        });
    },

    setOutboundStop: (outboundStop) => {
      localforage.setItem('busStopOutbound', outboundStop)
        .then((outboundStop) => {
          console.log('Saving outboundStop: ', outboundStop);
          return outboundStop;
        }).catch((err) => {
          console.warn(err);
        });
    },

    //////////////////////////////////////////


    getInboundRoute: (inboundRoute) => {
      return localforage.getItem('busRouteInbound');
    },

    getInboundStop: (inboundStop) => {
      return localforage.getItem('busStopInbound');
    },

    getOutboundRoute: (outboundRoute) => {
      return localforage.getItem('busRouteOutbound');
    },

    getOutboundStop: (outboundStop) => {
      return localforage.getItem('busStopOutbound');
    }

  };
});



// {"errorcode":"0","errormessage":"","numberofresults":3,"stopid":"1478","timestamp":"13\/11\/2016 19:51:26","results":[{"arrivaldatetime":"13\/11\/2016 20:05:11","duetime":"13","departuredatetime":"13\/11\/2016 20:05:11","departureduetime":"13","scheduledarrivaldatetime":"13\/11\/2016 20:05:00","scheduleddeparturedatetime":"13\/11\/2016 20:05:00","destination":"Ballywaltrim","destinationlocalized":"Baile Bhaltraim","origin":"Heuston Station","originlocalized":"Stáisiun Heuston","direction":"Outbound","operator":"bac","additionalinformation":"","lowfloorstatus":"no","route":"145","sourcetimestamp":"13\/11\/2016 19:06:29","monitored":"true"},{"arrivaldatetime":"13\/11\/2016 20:25:11","duetime":"33","departuredatetime":"13\/11\/2016 20:25:11","departureduetime":"33","scheduledarrivaldatetime":"13\/11\/2016 20:25:00","scheduleddeparturedatetime":"13\/11\/2016 20:25:00","destination":"Ballywaltrim","destinationlocalized":"Baile Bhaltraim","origin":"Heuston Station","originlocalized":"Stáisiun Heuston","direction":"Outbound","operator":"bac","additionalinformation":"","lowfloorstatus":"no","route":"145","sourcetimestamp":"13\/11\/2016 19:26:17","monitored":"true"},{"arrivaldatetime":"13\/11\/2016 20:44:35","duetime":"53","departuredatetime":"13\/11\/2016 20:44:35","departureduetime":"53","scheduledarrivaldatetime":"13\/11\/2016 20:45:00","scheduleddeparturedatetime":"13\/11\/2016 20:45:00","destination":"Ballywaltrim","destinationlocalized":"Baile Bhaltraim","origin":"Heuston Station","originlocalized":"Stáisiun Heuston","direction":"Outbound","operator":"bac","additionalinformation":"","lowfloorstatus":"no","route":"145","sourcetimestamp":"13\/11\/2016 19:46:05","monitored":"true"}]}
