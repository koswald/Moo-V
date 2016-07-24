
angular.module('movie-list').controller('listCtrl', [

	'$scope',
	'$state',
	'myMoviesFactory',
	'$cacheFactory',
	'myMoviesUrl',
	'myMoviesUrlFallback01',

	function($scope, $state, myMoviesFactory, $cacheFactory, myMoviesUrl, myMoviesUrlFallback01) {

		$scope.mainUrl = myMoviesUrl;
		$scope.fallbackUrl = myMoviesUrlFallback01;
		$scope.success = false;
		$scope.errored = false;
		$scope.status = "";

		// get the movie list

		$scope.getMovies = function() {

			$scope.success = false;
			$scope.errored = false;
			$scope.status = "";

			$scope.getKarlsMovies()
			.then(null, $scope.getKarlsMoviesFallback01)
			.then(

				function(response) {

					$scope.success = true;
					$scope.status = "";
					$scope.movies = response;

				}, function(error) {

					$scope.errored = true;
					$scope.status = "Couldn't get Karl's movies. His server isn't functioning or he hasn't added any movies yet.";
					$scope.errorDetail = error;
				}
			);
		}
		$scope.getKarlsMovies = function() {

			$scope.status = "Getting movies from main url: " + myMoviesUrl;
			return myMoviesFactory.getMyMovies(myMoviesUrl);
		}
		$scope.getKarlsMoviesFallback01 = function() {

			$scope.status = "Getting movies from fall-back url: " + myMoviesUrlFallback01
			return myMoviesFactory.getMyMovies(myMoviesUrlFallback01);
		}

		$scope.removeKarlsMovie = function () {
			$scope.status = "Removing \"" + $scope.title + "\" via the main url " + myMoviesUrl;
			return myMoviesFactory.removeTitle($scope.title, myMoviesUrl);
		}
		$scope.removeKarlsMovieFallback01 = function () {
			$scope.status = "Removing \"" + $scope.title + "\" via the fall-back url " + myMoviesUrlFallback01;
			return myMoviesFactory.removeTitle($scope.title, myMoviesUrlFallback01)
		}

		// remove a movie from the list

//		// the old non-angular way: letting the click event bubble up to the top of the table
//		// (the angular way is to keep the controller more unaware of the DOM)
//		$scope.removeMovie = function($event) {
//			// get the title associated with the button that was clicked
//			$scope.title = angular.element($event.target).scope().x.title;

		$scope.removeMovie = function(title) {

			$scope.title = title;
			$scope.status = "";
			$scope.success = false;
			$scope.errored = false;

			$scope.removeKarlsMovie()
			.then(null, $scope.removeKarlsMovieFallback01)
			.then(

				function(response) {

					// the movie was removed okay, so
					// get the updated list of movies

					$scope.success = true;
					$scope.status = "";
					$scope.getMovies();

				}, function(error) {

					// failed to remove the movie

					$scope.errored = true;
					$scope.status = "Couldn't remove " + title;
					$scope.errorDetail = error;
				}
			);
		}
		$scope.movieDetails = function(title) {

			// cache the title

			$cacheFactory.get("mooVCache").put('title', title);

			// go to the details state/page

			$state.go("movie-details");
		}
		$scope.getMovies();
	}
]);