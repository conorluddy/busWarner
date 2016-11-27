

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
      bus.barDisplayPercent =  100 - (bus.duePercent * 100);
      bus.barDisplayPercent = bus.barDisplayPercent * -1;
      bus.barDisplayPercent = bus.barDisplayPercent + bus.dueDamper;
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
  .controller('IncomingBussesCtrl', function($scope, Busses) {
    function update() {
      return Busses.get(145, 3148).then((busses) => {
        _calcBusses(busses, $scope);
      });
    }

    $scope.$on('$ionicView.enter', update);

    $scope.doRefresh = () => {
      update().finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
       });
    };

    // let refreshCountdown =
    setInterval(update, 20 * 1000);

    // function timeDisplay() {
    //   if (eta._isAMomentObject) {
    //     $scope.$apply(()=>{
    //       seconds = eta.diff(moment(), 'seconds');
    //       $scope.nextBus.til = Math.floor(seconds/60) + ':' + (seconds%60 > 9 ? seconds%60 : '0' + seconds%60);
    //     });
    //   }
    // };

  })




  .controller('HomeBussesCtrl', function($scope, Busses) {

    function update() {
      return Busses.get(145, 1478).then((busses) => {
        _calcBusses(busses, $scope);
      });
    }

    $scope.$on('$ionicView.enter', update);

    $scope.doRefresh = () => {
      update().finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
       });
    };

    // let refreshCountdown =
    setInterval(update, 20 * 1000);

  })





  .controller('AccountCtrl', function($scope, Stops) {
    $scope.settings = {
      enableFriends: true
    };

    Stops.get().then((stops)=>{
      $scope.stops = stops;
    });

  });
