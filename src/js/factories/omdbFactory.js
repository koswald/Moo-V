
angular.module('movie-list').factory('omdbFactory', [

	'$http',
	'omdbUrl',

	function($http, omdbUrl) {
		return {
			getSummary: function(title) {
				return $http.get(omdbUrl + '/?t=' + encodeURIComponent(title));
			},
			getDetails: function(title) {
				return $http.get(omdbUrl + '/?t=' + encodeURIComponent(title) + '&plot=full&tomatoes=true');
			},

			// this functionality is planned to be added in the future
		//	search: function(title) {
		//		return $http.get(omdbUrl + '/?s=' + encodeURIComponent(title));
		//	}
		}
	}



]);

