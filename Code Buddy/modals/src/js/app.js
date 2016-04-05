var app = angular.module("ui.bootstrap.demo", ['ui.bootstrap', "firebase"]);

app.controller('ModalCtrl', function ($scope, $window, $uibModal, $log) {

    // Opens the signIn modal window after button is clicked on User Interface
    $scope.signIn = function (size) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'signIn.html',
            controller: 'signInController',
            size: size
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };

    // Opens the signUp modal window after button is clicked on User Interface
    $scope.signUp = function (size) {
        var modalInstance = $uibModal.open({
            animation: true,
            templateUrl: 'signUp.html',
            controller: 'signUpController',
            size: size
        });

        modalInstance.result.then(function (selectedItem) {
            $scope.selected = selectedItem;
        }, function () {
            $log.info('Modal dismissed at: ' + new Date());
        });
    };
    
    
    $scope.fastSign = function(){

        var ref = new Firebase("https://dazzling-fire-6299.firebaseio.com");

        ref.authWithPassword({
            email: $scope.email,
            password: $scope.password
            }, function(error, authData) {
                if (error) {
                    console.log("Login Failed!", error);
                } else {
                    console.log("Authenticated successfully with payload:", authData);
                    $window.location.href = 'profile.html';
                }
            });
    };




});


app.controller('signInController',["$scope", "authService", function($scope, authService, $uibModalInstance){


    $scope.ok = function () {

        authService.signIn($scope.email, $scope.password);
        // wrap this in a conditional statement
        $scope.$dismiss();

    };

    $scope.cancel = function () {

		$scope.$dismiss();

    };

}]);

app.controller('signUpController',["$scope", "authService", function($scope, authService, $uibModalInstance){


    $scope.ok = function () {

        authService.signUp($scope.email, $scope.password);
        // wrap this in a conditional statement
        $scope.$dismiss();

    };

    $scope.cancel = function () {

        $scope.$dismiss();

    };

}]);


app.service('authService', function($window){


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

    this.signUp = function(emailIn, passwordIn){

        ref.createUser({
            email: emailIn,
            password: passwordIn
        }, function(error, userData) {
            if (error) {
                switch (error.code) {
                    case "EMAIL_TAKEN":
                        console.log("The new user account cannot be created because the email is already in use.");
                        break;
                    case "INVALID_EMAIL":
                        console.log("The specified email is not a valid email.");
                        break;
                    default:
                        console.log("Error creating user:", error);
                }
            } else {
                console.log("Successfully created user account with uid:", userData.uid);

            }
        });


    };



});