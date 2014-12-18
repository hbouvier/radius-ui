// To have one place where we define both the 'url' use in the javascript pages and the routes (because the
// $routeProvider cannot use the $rootScope, we have to define a global (beuark) variable here.
(function () {
    var ___g_RadiusUIRoutePrefix___ = '/home';
    angular
        .module('RadiusUI', ['ngRoute', 'RadiusUIServices', 'RadiusUIControllers'])
        .run(function ($rootScope) {
            $rootScope.baseAPIurl = '/radius/api/v1';
            $rootScope.baseUIurl = '/';
            $rootScope.urlBasePath = ___g_RadiusUIRoutePrefix___;
        })
        .config(['$routeProvider', '$locationProvider', function ($routeProvider, $locationProvider) {
            $routeProvider.
                when(___g_RadiusUIRoutePrefix___, {controller: 'RadiusUICtrl', templateUrl: 'views/RadiusUI.html'}).
                otherwise({redirectTo: ___g_RadiusUIRoutePrefix___});
        }])
    ;
})();
