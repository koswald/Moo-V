
angular.module('movie-list').controller('resultsCtrl', [
	
	// dependencies

	'$scope',
	'$state',
	'$cacheFactory',
	'omdbFactory',
	'omdbUrl',

	function($scope, $state, $cacheFactory, omdbFactory, omdbUrl) {

		$scope.results = { searchStatus: "", cache: $cacheFactory.get('mooVCache') };
		$scope.omdbUrl = omdbUrl;

		// get title from cache, in case arriving from another page,
		// set cache title to "" in order to prevent the movie Undefined from appearing on the 
		// details page by default

		if ($scope.results.cache.get('title')) {
			$scope.results.title = $scope.results.cache.get('title'); // get the title from cache
		} else {
			 $scope.results.title = "";
			 $scope.results.cache.put("title", "");
		}

		// prepare to send a request to OMDB

		$scope.results.searchSubmit = function() {

			$scope.results.succeeded = false;
			$scope.results.errored = false;
			$scope.results.searchStatus = "Searching . . .";
			$scope.omdb = { movies: "" };
			$scope.results.cache.put('title', $scope.title); // save title to cache

			// send the request

			omdbFactory.getSummary($scope.results.title).then(
				function(response) {

					// OMDB call was successful: something was returned, possibly an error message

					$scope.results.searchStatus = "";
					$scope.omdb.movies = response.data;
					$scope.results.succeeded = $scope.omdb.movies.Response == "True";
					$scope.results.errored = !$scope.results.succeeded;
					if ($scope.omdb.movies.Title) {
						$scope.results.title = $scope.omdb.movies.Title;
						$scope.results.cache.put("title", $scope.results.title);
					}
					$state.go("search-results.list"); 
				}, function (error) {

					// OMDB call failed

					$scope.results.searchStatus = 'Could not connect to http://www.omdbapi.com.';
				}
			);
		}

		// show the abbreviated details right away, if 
		// for example we are coming from another page/state

		if ($scope.results.title) $scope.results.searchSubmit(); 

		// navigate to the details page (on button click)

		$scope.results.movieDetails = function() {
			$state.go("movie-details");
		}
		
		// scroll down or else requested raw data may be hidden from view

		$scope.results.scrollDown = function() {
			window.scrollBy(0, 300);
		}
	}
]);
