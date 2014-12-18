(function () {
angular
  .module('RadiusUIServices', ['ngResource','xeditable'])
  .run(function(editableOptions) {
    editableOptions.theme = 'bs3'; // bootstrap3 theme. Can be also 'bs2', 'default'
  })
  .filter('objectFilter', function ($rootScope) {
    return function (input, query) {
      if (!query) return input;
      var result = [];

      angular.forEach(input, function (object) {
        var copy = {};
        var regex = new RegExp(query, 'im');
        console.log('object:', object, ', query:', query);
        for (var i in object) {
          // angular adds '$$hashKey' to the object.
          if (object.hasOwnProperty(i) && i !== '$$hashKey')
            copy[i] = object[i];
        }
        if (JSON.stringify(copy).match(regex)) {
          result.unshift(object);
        }
      });
      return result;
    };
  })
  .factory('Account', function ($rootScope, $resource) {
    var impl = $resource(
      $rootScope.baseAPIurl + '/reset',
      null,
      {
        "post"    : { method : "POST" }
      }
    );
    return impl;
  })
  ;
})();
