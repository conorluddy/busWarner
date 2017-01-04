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
    get: () => {
      return localforage.getItem('stopCache');
    },
    /**
     * Run on initial boot and store all stops into our DB
     */
    buildCache: () => {
      let url = 'https://data.dublinked.ie/cgi-bin/rtpi/busstopinformation?&format=json';//Baile Atha Cliath ;)

      return $http.get(url).then((response) => {
        return localforage.setItem('stopCache', response.data.results)
          .then((stops) => {
            if (stops) {
              console.log('Stored stops in DB: ', stops);
              return true;
            } else {
              console.warn('Cant get stops');
              return false;
            }
          });
      }).catch(function(errResponse){
        console.log(errResponse);
      });
    },

    /**
     * return all of the stops along the provided route
     */
    getRouteStops: (routeId, operator = 'bac') => {
      let url = 'https://data.dublinked.ie/cgi-bin/rtpi/routeinformation?&format=json&routeid=' + routeId + '&operator=' + operator;//Baile Atha Cliath

      if (!routeId || !operator) {
        console.warn('No route ID or no operator');
        return [];
      }

      return new Promise((resolve, reject) => {
          /**
           * If we looked this route up before it should be cached.
           * Else ping the URL and cache the response in localforage for next time
           */
          localforage.getItem('routeStops' + routeId).then((stops) => {
            if (stops) {
              console.log('Cached stops: ', stops);
              resolve(stops);
            } else {
              return $http.get(url).then((response) => {
                if (parseInt(response.data.errorcode) !== 0) {
                  console.warn(response);
                  reject();
                } else {
                  //Store for next time
                  localforage.setItem(('routeStops' + routeId), response.data.results);
                  resolve(response.data.results);
                }
              }).catch(function(errResponse){
                console.log(errResponse);
                reject();
              });
            }
          });
      });

    }
  };
})







.factory('Routes', ($http) => {
  return {

    getAll: () => {
      return localforage.getItem('routeCache');
    },
    /**
     * Run on initial boot and store all routes into our DB
     */
    buildCache: () => {
      let url = 'https://data.dublinked.ie/cgi-bin/rtpi/routelistinformation?&format=json&operator=bac';//Baile Atha Cliath ;)

      return $http.get(url)
        .then((response) => {
          let routeList = [];
          let routeData = response ? response.data.results : false;

          if (routeData) {
            for (var i = 0; i < routeData.length; i++) {
              //Stripping out routes that dont begin with a digit.
              //Check net log to see why
              if (parseInt( routeData[i].route.charAt(0))) {
                routeList.push(routeData[i].route);
              }
            }
          }

          return localforage.setItem('routeCache', routeList)
            .then((routes) => {
              if (routes) {
                console.log('Stored routes in DB: ', routes);
                return true;
              } else {
                console.warn('Cant get routes');
                return false;
              }
            });

      }).catch(function(errResponse){
        console.log(errResponse);
      });
    },


    buildRouteDetailCache: (route) => {
      console.log(route);
    }

  };
})











// localforage.getItem('busStop').then((busStop)=>{
//   route = busRoute;
//   stop = busStop;
// })

.factory('Settings', function() {
  return {
    /**
     * Application config
     */
    getPrimed: () => {
      return localforage.getItem('primed');
    },
    setPrimed: (primed) => {
      return localforage.setItem('primed', primed)
        .then((primed) => {
          return primed;
        })
    },

    /**
     * User preferred routes and stops
     */

    setInboundRoute: (inboundRoute) => {
      return localforage.setItem('busRouteInbound', inboundRoute)
        .then((inboundRoute) => {
          console.log('Saving inboundRoute: ', inboundRoute);
          return inboundRoute;
        }).catch((err) => {
          console.warn(err);
        });
    },

    setInboundStopDirection: (direction) => {
      return localforage.setItem('inboundStopDirection', direction)
        .then((direction) => {
          return direction;
        }).catch((err) => {
          console.warn(err);
        });
    },

    setInboundStop: (inboundStop) => {
      return localforage.setItem('busStopInbound', inboundStop)
        .then((inboundStop) => {
          console.log('Saving inboundStop: ', inboundStop);
          return inboundStop;
        }).catch((err) => {
          console.warn(err);
        });
    },

    setOutboundRoute: (outboundRoute) => {
      return localforage.setItem('busRouteOutbound', outboundRoute)
        .then((outboundRoute) => {
          console.log('Saving outboundRoute: ', outboundRoute);
          return outboundRoute;
        }).catch((err) => {
          console.warn(err);
        });
    },

    setOutboundStopDirection: (direction) => {
      return localforage.setItem('outboundStopDirection', direction)
        .then((direction) => {
          return direction;
        }).catch((err) => {
          console.warn(err);
        });
    },

    setOutboundStop: (outboundStop) => {
      return localforage.setItem('busStopOutbound', outboundStop)
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

    getInboundStopDirection: (inboundStopDirection) => {
      return localforage.getItem('inboundStopDirection');
    },

    getInboundStop: (inboundStop) => {
      return localforage.getItem('busStopInbound');
    },

    getOutboundRoute: (outboundRoute) => {
      return localforage.getItem('busRouteOutbound');
    },

    getOutboundStopDirection: (outboundStopDirection) => {
      return localforage.getItem('outboundStopDirection');
    },

    getOutboundStop: (outboundStop) => {
      return localforage.getItem('busStopOutbound');
    }

  };
});
