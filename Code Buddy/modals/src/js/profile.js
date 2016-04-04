    var app = angular.module('app', []);
        app.controller('profile', function($scope){
            
         
           
       // Create a callback which logs the current auth state
        function authDataCallback(authData) {
        if (authData) {
            console.log("User " + authData.uid + " is logged in with " + authData.provider);
        
        } else {
            console.log("User is logged out");
        }
     
    }



// Register the callback to be fired every time auth state changes
 var ref = new Firebase("https://dazzling-fire-6299.firebaseio.com/page=Auth/");
ref.onAuth(authDataCallback);
            
            // we would probably save a profile when we register new users on our site
// we could also read the profile to see if it's null
// here we will just simulate this with an isNewUser boolean
var isNewUser = true;

ref.onAuth(function(authData) {
  if (authData && isNewUser) {
    // save the user's profile into the database so we can list users,
    // use them in Security and Firebase Rules, and show profiles
    ref.child("users").child(authData.uid).set({
      provider: authData.provider,
      name: getName(authData)
         
    });
      $scope.myProfile = getName(authData);
  }
});

    $scope.signOut = function(){
                alert("legend");
                ref.unauth({
                    
                    
                });
               
				
                };
// find a suitable name based on the meta info given by each provider
function getName(authData) {
  switch(authData.provider) {
     case 'password':
       return authData.password.email.replace(/@.*/, '');
     case 'twitter':
       return authData.twitter.displayName;
     case 'facebook':
       return authData.facebook.displayName;
  }
}
            
           
            
            
            
        });