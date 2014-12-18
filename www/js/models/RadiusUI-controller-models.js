(function () {
    angular
        .module('RadiusUIModels', [])
        .factory('RadiusUIModel', function() {
            var model = {
                appVersion : '0.0.1',
                appName    : 'RadiusUI'
            };
            return model;
        })
    ;
})();
