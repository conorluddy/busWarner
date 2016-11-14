angular.module('starter.controllers', [])





.controller('IncomingBussesCtrl', function($scope, Busses) {
  let eta = 0;
  let seconds;

  let update = ()=> {
    return Busses.get(145, 3148).then((busses)=>{
      $scope.nextBus = busses[0];
      $scope.route = busses[0] ? busses[0].route : '';
      $scope.destination = busses[0] ? busses[0].destination : '';

      eta = moment(busses[0].arrivaldatetime, "DD/MM/YYYY HH:mm:ss");
      seconds = eta.diff(moment(), 'seconds');

      $scope.nextBus.due = {
        h: eta.format('HH'),
        m: eta.format('mm'),
        s: eta.format('ss')
      };

      $scope.nextBus.til = Math.floor(seconds/60) + ':' + (seconds%60 > 9 ? seconds%60 : '0' + seconds%60);

      etaAfter = moment(busses[1].arrivaldatetime, "DD/MM/YYYY HH:mm:ss");

      $scope.etaNextDiff = Math.floor(etaAfter.diff(eta) / 60000);
    });
  };


  let timeDisplay = ()=> {
    if (eta._isAMomentObject) {

      $scope.$apply(()=>{
        seconds = eta.diff(moment(), 'seconds');
        $scope.nextBus.til = Math.floor(seconds/60) + ':' + (seconds%60 > 9 ? seconds%60 : '0' + seconds%60);
      });
    }
  };


  $scope.$on('$ionicView.enter', update);
  $scope.doRefresh = () => {
    update().finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };


  // let refreshCountdown =
  setInterval(update, 15 * 1000);
  // let timeCountdown =
  setInterval(timeDisplay, 1000);

})




.controller('HomeBussesCtrl', function($scope, Busses) {
  let eta = 0;
  let seconds;

  let update = ()=> {
    return Busses.get(145, 1478).then((busses)=>{

      $scope.nextBus = busses[0];
      $scope.route = busses[0] ? busses[0].route : '';
      $scope.destination = busses[0] ? busses[0].destination : '';

      eta = moment(busses[0].arrivaldatetime, "DD/MM/YYYY HH:mm:ss");
      seconds = eta.diff(moment(), 'seconds');

      $scope.nextBus.due = {
        h: eta.format('HH'),
        m: eta.format('mm'),
        s: eta.format('ss')
      };

      $scope.nextBus.til = Math.floor(seconds/60) + ':' + (seconds%60 > 9 ? seconds%60 : '0' + seconds%60);

      etaAfter = moment(busses[1].arrivaldatetime, "DD/MM/YYYY HH:mm:ss");

      $scope.etaNextDiff = Math.floor(etaAfter.diff(eta) / 60000);
    });
  };


  let timeDisplay = ()=> {
    if (eta._isAMomentObject) {

      $scope.$apply(()=>{
        seconds = eta.diff(moment(), 'seconds');
        $scope.nextBus.til = Math.floor(seconds/60) + ':' + (seconds%60 > 9 ? seconds%60 : '0' + seconds%60);
      });
    }
  };


  $scope.$on('$ionicView.enter', update);
  $scope.doRefresh = () => {
    update().finally(function() {
       // Stop the ion-refresher from spinning
       $scope.$broadcast('scroll.refreshComplete');
     });
  };


  // let refreshCountdown =
  setInterval(update, 15 * 1000);
  // let timeCountdown =
  setInterval(timeDisplay, 1000);

})



.controller('AccountCtrl', function($scope, Stops) {
  $scope.settings = {
    enableFriends: true
  };

  Stops.get().then((stops)=>{
    $scope.stops = stops;
  });

});
