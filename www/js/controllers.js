function _calcBusses(busses, stop, $scope) {
  busses.forEach((bus) => {
    bus.eta = moment(bus.arrivaldatetime, "DD/MM/YYYY HH:mm:ss");
    bus.etaSecs = bus.eta.diff(moment(), 'seconds');
    bus.etaMins = bus.eta.diff(moment(), 'minutes');
    bus.dueTime = {
      h: bus.eta.format('HH'),
      m: bus.eta.format('mm'),
      s: bus.eta.format('ss')
    };
    bus.duePercent = bus.etaSecs / (60 * 60); //Percent as secs/secs in hour.
    bus.dueDamper = bus.duePercent * 20; //Increases as bar decreases, so it eases to "0". Actual 0 will hide it, so this is a cheat
    bus.barDisplayPercent = 100 - (bus.duePercent * 100);
    bus.barDisplayPercent = bus.barDisplayPercent * -1;
    bus.barDisplayPercent = bus.barDisplayPercent + bus.dueDamper;
    bus.barDisplayPercent = bus.barDisplayPercent > 0 ? 0 : bus.barDisplayPercent;
    bus.barDisplayPercent += '%';
    bus.barStyle = 'transform: rotate(-15deg) translateX(' + bus.barDisplayPercent + ');';
    bus.barCold = bus.duePercent > 0.5;
  });



  angular.extend($scope, {
    nextBus: busses[0],
    busses: busses,
    // busses: busses.splice(1, busses.length), //Leave out the first one from the bars
    route: busses[0] ? busses[0].route : '',
    stop: stop,
    destination: busses[0] ? busses[0].destination : ''
  });

}



function _listDirections(route, Stops, $scope) {
  return Stops.getRouteStops(route)
    .then((directions) => {
      let opts = [];
      if (directions) {
        directions.forEach((dir) => {
          opts.push(dir.destination);
        })
      }
      return opts;
    }).catch((e) => {
      console.log(e);
    });
}


angular.module('starter.controllers', [])
  .controller('LandingCtrl', function($scope, Settings, Stops, Routes) {

    // If not primed then go fetch stops and routes.
    // localforage.clear();

    Settings.getPrimed().then((primed) => {
      if (primed) {
        ////
        console.log('Already primed.');
        ////
      } else {
        ////
        console.log('Build caches');
        ////
        Stops.buildCache().then((stops) => {
            Routes.buildCache().then((routes) => {
              Settings.setPrimed(true);
            });
          })
          .catch((e) => {
            ////
            console.warn(e);
            ////
          });
      }
    });
  })












.controller('IncomingBussesCtrl', function($scope, Busses, Settings) {
  $scope.hasRouteAndStop = false;

  Settings.getInboundRoute().then((route) => {
    Settings.getInboundStop().then((stop) => {

      console.log('Incoming route: ', route);
      console.log('Incoming stop: ', stop);

      // hasRoute = (route && stop);

      $scope.hasRouteAndStop = route && stop;

      update(route, stop);
      ////////////////////////////////////////////////////////////////////////
      $scope.doRefresh = function() {
        update(route, stop).finally(() => {
          $scope.$broadcast('scroll.refreshComplete');
        });
      };
      ////////////////////////////////////////////////////////////////////////

    });
  }).catch((e) => {
    console.warn(e);
  });

  function update(inboundRoute, inboundStop) {
    return Busses.get(inboundRoute, inboundStop).then((busses) => {
      _calcBusses(busses, inboundStop, $scope);
    });
  }

  //ToDo: Dry this up
  $scope.$on('$ionicView.enter', function() {
    Settings.getInboundRoute().then((route) => {
      Settings.getInboundStop().then((stop) => {

        console.log('Incoming route: ', route, stop);

        $scope.hasRouteAndStop = route && stop;

        update(route, stop);
        ////////////////////////////////////////////////////////////////////////
        $scope.doRefresh = function() {
          update(route, stop).finally(() => {
            $scope.$broadcast('scroll.refreshComplete');
          });
        };
        ////////////////////////////////////////////////////////////////////////

      });
    }).catch((e) => {
      console.warn(e);
    });
  });



})









//////////////////////////////////////////////////////////////////////////////

.controller('HomeBussesCtrl', function($scope, Busses, Settings) {
  $scope.hasRouteAndStop = false;

  Settings.getOutboundRoute().then((route) => {
    Settings.getOutboundStop().then((stop) => {

      $scope.hasRouteAndStop = route && stop;
      update(route, stop);
      ////////////////////////////////////////////////////////////////////////
      $scope.doRefresh = function() {
        update(route, stop).finally(() => {
          $scope.$broadcast('scroll.refreshComplete');
        });
      };
      ////////////////////////////////////////////////////////////////////////

    });
  }).catch((e) => {
    console.warn(e);
  });

  function update(outboundRoute, outboundStop) {

    console.log('Update outboundRoute: ', outboundRoute);
    console.log('Update outboundStop: ', outboundStop);

    return Busses.get(outboundRoute, outboundStop).then((busses) => {
      console.log(busses);
      _calcBusses(busses, outboundStop, $scope);
    });
  }


  //ToDo: Dry this up
  $scope.$on('$ionicView.enter', function() {
    Settings.getOutboundRoute().then((route) => {
      Settings.getOutboundStop().then((stop) => {

        console.log('Outgoing route: ', route, stop);

        $scope.hasRouteAndStop = route && stop;
        update(route, stop);
        ////////////////////////////////////////////////////////////////////////
        $scope.doRefresh = function() {
          update(route, stop).finally(() => {
            $scope.$broadcast('scroll.refreshComplete');
          });
        };
        ////////////////////////////////////////////////////////////////////////

      });
    }).catch((e) => {
      console.warn(e);
    });
  });

})






//////////////////////////////////////////////////////////////////////////////

.controller('AccountCtrl', function($scope, Stops, Settings, Routes) {
  $scope.form = {};

  /**
   * Get all routes and populate select
   */
  Routes.getAll().then((routes) => {
    $scope.$apply(() => {
      $scope.routes = routes;
    });
  });

  Settings.getInboundRoute().then((route) => {
    $scope.$apply(() => {
      $scope.form.routeInbound = route;
    });

    Stops.getRouteStops(route).then((stops) => {
      //Populate the dropdown based on what this returns
      let stopList = [];
      let stopsPerDirection = [];
      let direction = '';

      //Create dropdown friendly list
      for (let i = 0; i < stops.length; i++) {

        direction = stops[i].destination;
        stopsPerDirection = stops[i].stops;
        for (var j = 0; j < stopsPerDirection.length; j++) {

          // console.log(stopsPerDirection[j].latitude);
          // console.log(stopsPerDirection[j].longitude);
          // http://maps.googleapis.com/maps/api/geocode/json?latlng=53.346555,-6.258156111&sensor=true

          stopList.push({
            direction: direction,
            id: stopsPerDirection[j].stopid,
            name: stopsPerDirection[j].shortname,
            // label: 'Towards ' + direction + ', Stop ' + stopsPerDirection[j].stopid + stopsPerDirection[j].shortname
            label: stopsPerDirection[j].stopid// + ' - Towards ' + direction
          });
        }
      }

      stopList = stopList.sort((a, b) => {
        let idA = parseInt(a.id);
        let idB = parseInt(b.id);
        if (idA < idB) return -1;
        if (idA > idB) return 1;
        return 0;
      });

      Settings.getInboundStop().then((stop) => {
        $scope.$apply(() => {
          $scope.stopsInward = stopList;
          $scope.form.stopInbound = stop;
        });
      });

    });
  });

  // TODO : dry this up

  $scope.routeInboundSelected = function() {

    Settings.setInboundRoute($scope.form.routeInbound);

    Stops.getRouteStops($scope.form.routeInbound).then((stops) => {
      //Populate the dropdown based on what this returns
      let stopList = [];
      let stopsPerDirection = [];
      let direction = '';

      //Create dropdown friendly list
      for (let i = 0; i < stops.length; i++) {
        direction = stops[i].destination;
        stopsPerDirection = stops[i].stops;
        for (var j = 0; j < stopsPerDirection.length; j++) {
          stopList.push({
            direction: direction,
            id: stopsPerDirection[j].stopid,
            name: stopsPerDirection[j].shortname,
            // label: direction + stopsPerDirection[j].stopid + stopsPerDirection[j].shortname
            label: stopsPerDirection[j].stopid// + ' - Towards ' + direction
          });
        }
      }

      stopList = stopList.sort((a, b) => {
        let idA = parseInt(a.id);
        let idB = parseInt(b.id);
        if (idA < idB) return -1;
        if (idA > idB) return 1;
        return 0;
      });

      //Route changed so wipe stop
      $scope.$apply(() => {
        $scope.stopsInward = stopList;
        $scope.form.stopInbound = '';
      });

    });
  };

  $scope.stopInboundSelected = function() {
    Settings.setInboundStop($scope.form.stopInbound);
  };









  Settings.getOutboundRoute().then((route) => {
    $scope.$apply(() => {
      $scope.form.routeOutbound = route;
    });
    Stops.getRouteStops(route).then((stops) => {
      //Populate the dropdown based on what this returns
      let stopList = [];
      let stopsPerDirection = [];
      let direction = '';

      //Create dropdown friendly list
      for (let i = 0; i < stops.length; i++) {
        direction = stops[i].destination;
        stopsPerDirection = stops[i].stops;
        for (var j = 0; j < stopsPerDirection.length; j++) {
          stopList.push({
            direction: direction,
            id: stopsPerDirection[j].stopid,
            name: stopsPerDirection[j].shortname,
            // label: direction + stopsPerDirection[j].stopid + stopsPerDirection[j].shortname
            label: stopsPerDirection[j].stopid// + ' - Towards ' + direction
          });
        }
      }

      stopList = stopList.sort((a, b) => {
        let idA = parseInt(a.id);
        let idB = parseInt(b.id);
        if (idA < idB) return -1;
        if (idA > idB) return 1;
        return 0;
      });

      Settings.getOutboundStop().then((stop) => {
        $scope.$apply(() => {
          $scope.stopsOutward = stopList;
          $scope.form.stopOutbound = stop;
        });
      });

    });
  });

  // TODO : dry this up

  $scope.routeOutboundSelected = function() {

    Settings.setOutboundRoute($scope.form.routeOutbound);

    Stops.getRouteStops($scope.form.routeOutbound).then((stops) => {
      //Populate the dropdown based on what this returns
      let stopList = [];
      let stopsPerDirection = [];
      let direction = '';

      //Create dropdown friendly list
      for (let i = 0; i < stops.length; i++) {
        direction = stops[i].destination;
        stopsPerDirection = stops[i].stops;
        for (var j = 0; j < stopsPerDirection.length; j++) {
          stopList.push({
            direction: direction,
            id: stopsPerDirection[j].stopid,
            name: stopsPerDirection[j].shortname,
            // label: direction + stopsPerDirection[j].stopid + stopsPerDirection[j].shortname
            label: stopsPerDirection[j].stopid// + ' - Towards ' + direction
          });
        }
      }

      stopList = stopList.sort((a, b) => {
        let idA = parseInt(a.id);
        let idB = parseInt(b.id);
        if (idA < idB) return -1;
        if (idA > idB) return 1;
        return 0;
      });

      //Route changed so wipe stop
      $scope.$apply(() => {
        $scope.stopsOutward = stopList;
        $scope.form.stopOutbound = '';
      });

    });
  };


  $scope.stopOutboundSelected = function() {
    Settings.setOutboundStop($scope.form.stopOutbound);
  };




});
