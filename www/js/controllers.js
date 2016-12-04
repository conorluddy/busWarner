

function _calcBusses(busses, $scope) {
    busses.forEach((bus) => {
      bus.eta = moment(bus.arrivaldatetime, "DD/MM/YYYY HH:mm:ss");
      bus.etaSecs = bus.eta.diff(moment(), 'seconds');
      bus.etaMins = bus.eta.diff(moment(), 'minutes');
      bus.dueTime = {
        h: bus.eta.format('HH'),
        m: bus.eta.format('mm'),
        s: bus.eta.format('ss')
      };
      bus.duePercent = bus.etaSecs / (60*60);//Percent as secs/secs in hour.
      bus.dueDamper = bus.duePercent * 20;//Increases as bar decreases, so it eases to "0". Actual 0 will hide it, so this is a cheat
      bus.barDisplayPercent = 100 - (bus.duePercent * 100);
      bus.barDisplayPercent = bus.barDisplayPercent * -1;
      bus.barDisplayPercent = bus.barDisplayPercent + bus.dueDamper;
      bus.barDisplayPercent = bus.barDisplayPercent > 0 ? 0 : bus.barDisplayPercent;
      bus.barDisplayPercent += '%';
      bus.barStyle = 'transform: rotate(-15deg) translateX('+bus.barDisplayPercent+');';
      bus.barCold = bus.duePercent > 0.5;
    });

    angular.extend($scope, {
      nextBus: busses[0],
      busses: busses.splice(1, busses.length),
      route: busses[0] ? busses[0].route : '',
      destination: busses[0] ? busses[0].destination : ''
    });

}



angular.module('starter.controllers', [])


  .controller('LandingCtrl', function($scope, Settings, Stops, Routes) {

      // If not primed then go fetch stops and routes.
      // localforage.clear();

      Settings.getPrimed().then((primed) => {
        if (primed) {
          console.log('Already primed.');

        } else {
          console.log('Build caches');

          Stops.buildCache().then((stops)=>{
            Routes.buildCache().then((routes)=>{
              Settings.setPrimed(true);
            });
          })
          .catch((e) => {
            console.warn(e);
          });
        }
      });
  })





  .controller('IncomingBussesCtrl', function($scope, Busses, Settings) {
    Settings.getInboundRoute().then((route)=>{
      Settings.getInboundStop().then((stop)=>{

        console.log('route: ', route);
        console.dir(stop);

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
        console.log(busses);
        _calcBusses(busses, $scope);
      });
    }

  })

  //////////////////////////////////////////////////////////////////////////////

  .controller('HomeBussesCtrl', function($scope, Busses, Settings) {
    Settings.getOutboundRoute().then((route)=>{
      Settings.getOutboundStop().then((stop)=>{

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
        _calcBusses(busses, $scope);
      });
    }
  })






  //////////////////////////////////////////////////////////////////////////////

  .controller('AccountCtrl', function($scope, Stops, Settings, Routes) {
    $scope.form = {};

    Settings.getInboundRoute().then((route)=>{
      $scope.$apply(()=>{
        $scope.form.routeInbound = route;
        listStops(route);
      });
    });
    $scope.routeInboundSelected = function() {
      Settings.setInboundRoute($scope.form.routeInbound);
      listStops($scope.form.routeInbound);
    };


    Settings.getInboundStop().then((stop)=>{
      $scope.$apply(()=>{
        $scope.form.stopInbound = stop;
      });
    });
    $scope.stopInboundSelected = function() {
      Settings.setInboundStop($scope.form.stopInbound);
      listStops($scope.form.stopInbound);
    };



    Routes.getAll().then((routes) => {
      $scope.$apply(()=>{
        $scope.routes = routes;
      });
    });


    function listStops(route) {
      return Stops.getRouteStops(route)
        .then((directions) => {
          if (directions.length === 1) {
            $scope.destinationA = directions[0].destination;
            $scope.stopsInward = directions[0];
          }
          if (directions.length === 2) {
            console.log(directions[0]);
            $scope.destinationA = directions[0].destination;
            $scope.destinationB = directions[1].destination;
            $scope.stopsInward = directions[0].stops;
            $scope.stopsOutward = directions[1].stops;
          }
      });
    }

    Stops.getStopInformation();



    // Stops.get();
    // Routes.getDublinBusses();
    // Stops.getRouteStops('145');
    //
    // Settings.getInboundRoute().then((route)=>{
    //   $scope.$apply(()=>{
    //     $scope.form.routeInbound = route;
    //   });
    // });
    // Settings.getInboundStop().then((stop)=>{
    //   $scope.$apply(()=>{
    //     $scope.form.stopInbound = stop;
    //   });
    // });
    // Settings.getOutboundRoute().then((route)=>{
    //   $scope.$apply(()=>{
    //     $scope.form.routeOutbound = route;
    //   });
    // });
    // Settings.getOutboundStop().then((stop)=>{
    //   $scope.$apply(()=>{
    //     $scope.form.stopOutbound = stop;
    //   });
    // });
    //
    // $scope.saveSettings = function(form) {
    //   if (form) {
    //     Settings.setInboundRoute(form.routeInbound);
    //     Settings.setInboundStop(form.stopInbound);
    //     Settings.setOutboundRoute(form.routeOutbound);
    //     Settings.setOutboundStop(form.stopOutbound);
    //   }
    // }

  });
