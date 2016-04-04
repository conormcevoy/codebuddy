var app = angular.module("ui.bootstrap.demo", ['ui.bootstrap', "firebase"]);

app.controller('ModalDemoCtrl', function ($scope, $uibModal, $log) {

    $scope.items = ['item1', 'item2', 'item3'];

    $scope.animationsEnabled = true;

    $scope.open = function (size) {
        var modalInstance = $uibModal.open({
            animation: $scope.animationsEnabled,
            templateUrl: 'myModalContent.html',
            controller: 'ModalInstanceCtrl',
            size: size,
            // resolve: {
            //     items: function () {
            //         return $scope.items;
            //     }
            // }
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    $scope.toggleAnimation = function () {
        $scope.animationsEnabled = !$scope.animationsEnabled;
    };

});

// Please note that $uibModalInstance represents a modal window (instance) dependency.
// It is not the same as the $uibModal service used above.

app.controller('ModalInstanceCtrl',["$scope", "authService", function($scope, authService, $uibModalInstance, items){


    $scope.ok = function () {
        authService.signIn($scope.email, $scope.password);
        // wrap this in a conditional statement
        $scope.$dismiss();

    };

    $scope.cancel = function () {
		$scope.$dismiss();
        //$uibModalInstance.dismiss('cancel');
    };
}]);

app.service('authService', function(){


    var ref = new Firebase("https://dazzling-fire-6299.firebaseio.com");

    this.signIn = function(emailIn, passwordIn){

        ref.authWithPassword({
            email: emailIn,
            password: passwordIn
        }, function(error, authData) {
            if (error) {
                console.log("Login Failed!", error);
            } else {
                console.log("Authenticated successfully with payload:", authData);
                $window.location.href = 'profile.html';
            }
        });

        return;
    };



});