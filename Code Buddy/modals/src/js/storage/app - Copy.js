var app = angular.module('ui.bootstrap.demo', ['ui.bootstrap']);
app.controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {
  
  

  


});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl', function ($scope, $uibModalInstance, items) {

  $scope.items = items;
  $scope.selected = {
    item: $scope.items[0]
  };

  $scope.signIn = function(){

  }

 
  $scope.ok = function () {

          $uibModalInstance.close($scope.selected.item);
      };


      $scope.cancel = function () {
          $uibModalInstance.dismiss('cancel');
      };

});







