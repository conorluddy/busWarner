

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

  .controller('IncomingBussesCtrl', function($scope, Busses, Settings) {
    Settings.getInboundRoute().then((route)=>{
      Settings.getInboundStop().then((stop)=>{

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

  .controller('AccountCtrl', function($scope, Stops, Settings) {
    $scope.form = {};

    Settings.getInboundRoute().then((route)=>{
      $scope.$apply(()=>{
        $scope.form.routeInbound = route;
      });
    });
    Settings.getInboundStop().then((stop)=>{
      $scope.$apply(()=>{
        $scope.form.stopInbound = stop;
      });
    });
    Settings.getOutboundRoute().then((route)=>{
      $scope.$apply(()=>{
        $scope.form.routeOutbound = route;
      });
    });
    Settings.getOutboundStop().then((stop)=>{
      $scope.$apply(()=>{
        $scope.form.stopOutbound = stop;
      });
    });

    $scope.saveSettings = function(form) {
      if (form) {
        Settings.setInboundRoute(form.routeInbound);
        Settings.setInboundStop(form.stopInbound);
        Settings.setOutboundRoute(form.routeOutbound);
        Settings.setOutboundStop(form.stopOutbound);
      }
    }

  });
