'use strict';

/* App Module */

angular.module('phonecat', []).
  config(['$routeProvider', function($routeProvider) {
  $routeProvider.
      when('/tab/:id', {templateUrl: 'html/tab-detail.html', controller: TabLoadCtrl}).
      otherwise({redirectTo: '/tab/0'});
}]);
