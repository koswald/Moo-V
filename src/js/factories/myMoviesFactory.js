angular.module('movie-list').factory('myMoviesFactory', [

   // dependencies
   '$http',

   function($http) {
      return {
         getMyMovies: function (url) {
            return $http.get(url);
         },
         addTitle: function(title, url) {
            return $http.post(url + "/" + encodeURIComponent(title));
         },
         removeTitle: function(title, url) {
            return $http.delete(url + "/" + encodeURIComponent(title) + "/delete");
         }
      }
   }

]);