(function () {
	angular
		.module('RadiusUIControllers', ['RadiusUIServices', 'RadiusUIModels'])
	    .controller('RadiusUICtrl', function($scope, $location, RadiusUIModel, Account) {
	        $scope.model = RadiusUIModel;

          $scope.validate = function(field, len) {
            len = len || 8;
            return (field && field.length >= len) ? true : false;
          };
          $scope.passwordsMatch = function(model) {
            return ($scope.validate(model.password) &&
                    $scope.validate(model.verifyPassword) &&
                    $scope.validate(model.username, 2) && 
                    model.password == model.verifyPassword
                   ) ? true : false;
          };

          $scope.resetPassword = function (model) {
            Account.post(
              {
                username:model.username,
                password:model.password,
                create:model.create?true:false
              }).$promise.then(function (result) {
              $scope.model.username = $scope.model.password = $scope.model.verifyPassword = "";
              $scope.model.create = false;
            },function (err) {
              alert("Unable to reset password for " + model.username + " because of " + err.statusText);
            });
          };
	    })
	;
})();
