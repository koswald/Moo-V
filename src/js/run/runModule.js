
angular.module("movie-list").run([

   '$rootScope',
   '$state',
   '$stateParams',
   '$cacheFactory',

   function($rootScope, $state, $stateParams, $cacheFactory) {

      // enable accessing state within a template

      $rootScope.$state = $state;
      $rootScope.$stateParams = $stateParams;

      // enable caching of variables to avoid polluting the global namespace, as much as possible

      $cacheFactory('mooVCache'); // create a (single) cache
   }     
]);