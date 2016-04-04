/**
 * Created by Conor on 02/04/2016.
 */
var data = angular.module('App.Data', []);

data.service('FirebaseDataService', ['$firebaseAuth', function ($firebaseAuth) {

    var root = new Firebase("https://dazzling-fire-6299.firebaseio.com");

    this.auth = $firebaseAuth(root);

    this.users = root.child('users');

    this.snippets = root.child('snippets');

}]);

data.service('AuthService', ['$rootScope', '$modal', 'FirebaseDataService', '$state', 'UsersDataService', function ($rootScope, $modal, FirebaseDataService, $state, UsersDataService) {

    var Auth = FirebaseDataService.auth;

    Auth.$onAuth(function (authData) {
        if (authData) {
            $rootScope.authData = authData;
            $rootScope.user = UsersDataService.getByUid(authData.uid);
            console.log("Auth update", $rootScope.authData, $rootScope.user);
        } else {
            delete $rootScope.user;
            delete $rootScope.authData;
        }
    });



    this.login = function (credentials, next) {
        Auth.$authWithPassword(credentials)
            .then(function (user) {
                return next(null, user);
            }).catch(function (err) {
            return next(err, null)
        });
    };



    this.openLoginModal = function (next) {

        // open the modal
        $modal.open({
            animation: true,
            templateUrl: 'myModalContent.html',

            // modal controller
            controller: ['$scope', '$rootScope', '$state', 'AuthService', 'UsersDataService', function ($scope, $rootScope, $state, AuthService, UsersDataService) {

                // login the user
                $scope.login = function (credentials) {
                    AuthService.login(credentials, function (err, user) {
                        if (err) return console.error("Could not log in user", err);
                        $scope.dismiss();
                        $rootScope.$emit('showAlert', {
                            type: "success",
                            message: "Logged in successfully"
                        });
                    });
                };

                // request a password reset
                $scope.requestPasswordReset = function () {
                    $state.go('site.request-password-reset');
                    $scope.$dismiss();
                };

                // close the modal
                $scope.dismiss = function () {
                    $scope.$dismiss();
                };

                // login was successful
                $scope.$on('login-success', function (event) {
                    $scope.dismiss();
                });

                // error during login
                $scope.$on('login-error', function (event, message) {
                    flash.to('login-flash').error = message
                });

            }]
        });
    }

}]);

data.service('UsersDataService', ['FirebaseDataService', '$firebaseObject', '$firebaseArray', '$rootScope', function (FirebaseDataService, $firebaseObject, $firebaseArray, $rootScope) {

    var Users = FirebaseDataService.users;

    this.getAll = function () {
        return $firebaseArray(Users);
    };

    this.addNew = function (user, uid) {
        console.log("Adding new user", user, uid);
        delete user.password;
        delete user.email;
        Users.child(uid).set(user);
    };

    this.remove = function (user) {
        user.$remove()
            .then(function (err) {
                return $rootScope.$emit('showAlert', {
                    type: "success",
                    message: "User removed successfully"
                });
            }).catch(function (err) {
            return $rootScope.$emit('showAlert', {
                type: "error",
                message: "User could not be removed\n" + err
            });
        });
    };

    this.update = function (user) {
        user.$save()
            .then(function (err) {
                return $rootScope.$emit('showAlert', {
                    type: "success",
                    message: "User saved successfully"
                });
            }).catch(function (err) {
            return $rootScope.$emit('showAlert', {
                type: "error",
                message: "User could not be saved\n" + err
            });
        });
    };

    this.getById = function (id) {
        return $firebaseObject(Users.child(id));
    };

    this.getByUid = function (uid) {
        var user = $firebaseObject(Users.child(uid));
        console.log("Found user", user);
        return user;
    };

}]);

data.service('SnippetsDataService', ['FirebaseDataService', '$firebaseObject', '$firebaseArray', '$rootScope', function (FirebaseDataService, $firebaseObject, $firebaseArray, $rootScope) {

    var Snippets = FirebaseDataService.snippets;

    this.getAll = function () {
        return $firebaseArray(Snippets);
    };

    this.addNew = function (snippet) {
        return $firebaseObject(Snippets.push(snippet, function (err) {
            if (err) return $rootScope.$emit('showAlert', {
                type: "error",
                message: "Snippet could not be added\n" + err
            });
            return $rootScope.$emit('showAlert', {
                type: "success",
                message: "Snippet added successfully"
            });
        }));
    };

    this.remove = function (snippet) {
        snippet.$remove()
            .then(function (err) {
                return $rootScope.$emit('showAlert', {
                    type: "success",
                    message: "Snippet removed successfully"
                });
            }).catch(function (err) {
            return $rootScope.$emit('showAlert', {
                type: "error",
                message: "Snippet could not be removed\n" + err
            });
        });
    };

    this.update = function (snippet) {
        snippet.$save()
            .then(function (err) {
                return $rootScope.$emit('showAlert', {
                    type: "success",
                    message: "Snippet saved successfully"
                });
            }).catch(function (err) {
            return $rootScope.$emit('showAlert', {
                type: "error",
                message: "Snippet could not be saved\n" + err
            });
        });
    };

    this.getById = function (id) {
        return $firebaseObject(Snippets.child(id));
    };

    this.getByCategory = function (category) {
        return $firebaseArray(Snippets.orderByChild("editor_mode").equalTo(category));
    };

}]);
