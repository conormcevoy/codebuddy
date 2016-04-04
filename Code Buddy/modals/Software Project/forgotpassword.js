 var app = angular.module('myApp', []); 
 app.controller('forgotPword', function($scope, $window){   
      var ref = new Firebase("https://dazzling-fire-6299.firebaseio.com");
      $scope.forgotPassword = function(){
				ref.resetPassword({
				  email: $scope.email
                  
				}, function(error) {
				  if (error) {
					switch (error.code) {
					  case "INVALID_USER":
						console.log("The specified user account does not exist.");
                        
						break;
					  default:
						console.log("Error resetting password:", error);
					}
				  } else {
					console.log("Password reset email sent successfully!");
				  }
				});
                };
});