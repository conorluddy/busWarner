angular.module('starter.controllers', [])





.controller('IncomingBussesCtrl', function($scope, Busses) {

  $scope.$on('$ionicView.enter', function(e) {
    console.log('x');
    Busses.get(145, 5127).then((busses)=>{
      $scope.busses = busses;
    });
  });


  $scope.doRefresh = function() {
      console.log('Refreshing');
      Busses.get(145, 5127).then((busses)=>{
        $scope.busses = busses;
      }).finally(function() {
         // Stop the ion-refresher from spinning
         $scope.$broadcast('scroll.refreshComplete');
       });
    };

})




.controller('HomeBussesCtrl', function($scope, Busses) {

  $scope.$on('$ionicView.enter', function(e) {
    console.log('y');
    Busses.get(145, 1478).then((busses)=>{
      $scope.busses = busses;

      console.log(busses[0]);

      $scope.route = busses[0] ? busses[0].route : '';
      $scope.destination = busses[0] ? busses[0].destination : '';
    });
  });

})



.controller('AccountCtrl', function($scope, Stops) {
  $scope.settings = {
    enableFriends: true
  };

  Stops.get().then((stops)=>{
    $scope.stops = stops;
  });

});
