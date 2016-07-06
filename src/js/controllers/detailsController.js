
angular.module('movie-list').controller('detailsCtrl', [

	'$scope',
	'$state',
	'$cacheFactory',
	'myMoviesFactory',
	'myMoviesUrl',
	'myMoviesUrlFallback01',
	'omdbFactory',

	function($scope, $state, $cacheFactory, myMoviesFactory, myMoviesUrl, myMoviesUrlFallback01, omdbFactory) {

		$scope.cache = $cacheFactory.get('mooVCache');
		$scope.succeeded = false;
		$scope.errored = false;
		$scope.title = $scope.cache.get('title')

		// get more details from OMDB, and maybe a poster too

		omdbFactory.getDetails($scope.title).then(
			function (response) {

				// call to OMDB came back OK

				$scope.details = response.data;
				$scope.succeeded = $scope.details.Response == "True";
				$scope.errored = !$scope.succeeded;
			}, function(error) {

				// call to OMDB failed, so
				// show the error

				$scope.detailsError = error;
			}
		);
		$scope.addToKarlsMovies = function() {
			return myMoviesFactory.addTitle($scope.title, myMoviesUrl);
		}
		$scope.addToKarlsMoviesFallback01 = function() {
			return myMoviesFactory.addTitle($scope.title, myMoviesUrlFallback01);
		}
		$scope.addMovie = function() {
			$scope.addToKarlsMovies()
			.then(null, $scope.addToKarlsMoviesFallback01)
			.then(
				function(response) {

					// added movie ok

					$scope.addMovieResponse = response;
					$state.go("karls-movies");
				}, function(error) {

					// adding the movie returned an error, but 
					// it could be an already-exists error, so go to the movies list anyway

					$scope.addMovieError = error;
					$state.go("karls-movies");
				}
			);
		}
		// scroll down or else requested raw data may be hidden from view

		$scope.scrollDown = function() {
			window.scrollBy(0, 300);
		}
	}
]);
