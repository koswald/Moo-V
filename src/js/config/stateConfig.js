
angular.module("movie-list").config(function($stateProvider, $urlRouterProvider) {

	$urlRouterProvider.otherwise("/search-results");

	$stateProvider
		.state("search-results", {
			url: "/search-results",
			templateUrl: "views/search-results.tpl.html",
			controller: "resultsCtrl"
		})
		.state("search-results.list", {
			url: "/list",
			templateUrl: "views/search-results.list.tpl.html",
			controller: "resultsCtrl"
		})
		.state("movie-details", {
			url: "/movie-details",
			templateUrl: "views/movie-details.tpl.html",
			controller: "detailsCtrl"
		})
		.state("karls-movies", {
			url: "/karls-movies",
			templateUrl: "views/movie-list.tpl.html",
			controller: "listCtrl"
		});
});