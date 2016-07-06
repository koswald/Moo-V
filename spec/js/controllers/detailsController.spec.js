
describe('Details controller', function() {

  var movieDetails = { data: { "Title":"High Noon", "Year":"1952","Rated":"PG","Released":"30 Jul 1952","Runtime":"85 min","Genre":"Western","Director":"Fred Zinnemann","Writer":"Carl Foreman (screenplay), John W. Cunningham (magazine story \"The Tin Star\")","Actors":"Gary Cooper, Thomas Mitchell, Lloyd Bridges, Katy Jurado","Plot":"On the day he gets married and hangs up his badge, lawman Will Kane is told that a man he sent to prison years before, Frank Miller, is returning on the noon train to exact his revenge. Having initially decided to leave with his new spouse, Will decides he must go back and face Miller. However, when he seeks the help of the townspeople he has protected for so long, they turn their backs on him. It seems Kane may have to face Miller alone, as well as the rest of Miller's gang, who are waiting for him at the station...","Language":"English, Spanish","Country":"USA","Awards":"Won 4 Oscars. Another 13 wins & 10 nominations.","Poster":"http://ia.media-imdb.com/images/M/MV5BMTUxMzg0MzIwM15BMl5BanBnXkFtZTgwOTU0MjkwMTE@._V1_SX300.jpg","Metascore":"89","imdbRating":"8.1","imdbVotes":"78,355","imdbID":"tt0044706","Type":"movie","tomatoMeter":"96","tomatoImage":"certified","tomatoRating":"8.8","tomatoReviews":"48","tomatoFresh":"46","tomatoRotten":"2","tomatoConsensus":"A classic of the Western genre that broke with many of the traditions at the time, High Noon endures -- in no small part thanks to Gary Cooper's defiant, Oscar-winning performance.","tomatoUserMeter":"89","tomatoUserRating":"4.0","tomatoUserReviews":"24843","tomatoURL":"http://www.rottentomatoes.com/m/1046060-high_noon/","DVD":"23 Oct 2001","BoxOffice":"N/A","Production":"United Artists","Website":"N/A","Response":"True" }};
  var errResponse = { data: {"Response":"False","Error":"Movie not found!"} };
  var addMovieData = { data: {"id":1,"title":"Jaws","active":true}};
  var $httpBackend;
  var $controller;
  var omdbFactory;
  var $q;
  var $scope;
  var $rootScope;
  var $cacheFactory;
  var omdbUrl;
  var myMoviesFactory;
  var myMoviesUrl;
  var myMoviesUrlFallback01;

  beforeEach(angular.mock.module('movie-list'));

  beforeEach(angular.mock.inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $controller = $injector.get('$controller');
    omdbFactory = $injector.get('omdbFactory');
    myMoviesFactory = $injector.get('myMoviesFactory');
    myMoviesUrl = $injector.get('myMoviesUrl');
    myMoviesUrlFallback01 = $injector.get('myMoviesUrlFallback01');
    $q = $injector.get('$q');
    $scope = {};
    $rootScope = $injector.get('$rootScope');
    $cacheFactory = $injector.get('$cacheFactory');
    omdbUrl = $injector.get('omdbUrl');
  }));

  it('should scroll', function() {

    var $window;
    inject(function($injector) {
      $window = $injector.get('$window');
    });
    spyOn($window, 'scrollBy');
    
    $controller('detailsCtrl', { $scope: $scope });
    $scope.scrollDown();

    expect($window.scrollBy).toHaveBeenCalledWith(0, 300);
  });

  it('should handle rejection when adding a movie', function() {

    var title = "King Kong: The Next Sequel";
    var errMsg = "Couldn't add the movie";

    // mock the myMoviesFactory; set up for rejecting
    spyOn(myMoviesFactory, 'addTitle').and.callFake(function() {
      var deferred = $q.defer();
      deferred.reject(errMsg);
      return deferred.promise;
    });

    $httpBackend.expect('GET', omdbUrl + '/?t=' + encodeURIComponent(title) + '&plot=full&tomatoes=true')
      .respond(200);
    $httpBackend.expect('GET', 'views/movie-list.tpl.html').respond(200);
    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);

    $cacheFactory.get('mooVCache').put('title', title);
    $controller('detailsCtrl', { $scope: $scope });
    $scope.addMovie();

    $rootScope.$apply();

    expect(myMoviesFactory.addTitle).toHaveBeenCalledWith(title, myMoviesUrl);
    expect(myMoviesFactory.addTitle).toHaveBeenCalledWith(title, myMoviesUrlFallback01);
    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should add a movie', function() {
    
    var title = "Star Wars Mania: the Obsession";

    spyOn(omdbFactory, 'getDetails').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve(movieDetails);
      return deferred.promise;
    });

    spyOn(myMoviesFactory, 'addTitle').and.callFake(function() {
      var deferred = $q.defer(); 
      deferred.resolve(addMovieData);
      return deferred.promise;
    });

    $httpBackend.expect('GET', 'views/movie-list.tpl.html').respond(200);
    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);
    $httpBackend.expect('GET', omdbUrl + '/?t=' + encodeURIComponent(title) + '&plot=full&tomatoes=true')
      .respond(200, movieDetails);
    $httpBackend.expect('GET', myMoviesUrl + encodeURIComponent(title))
      .respond(201, addMovieData);

    $cacheFactory.get('mooVCache').put('title', title); // pass in the title via cacheFactory
    $controller('detailsCtrl', { $scope: $scope });

    $scope.addMovie();
    $rootScope.$apply();

    expect($scope.addMovieResponse).toEqual(addMovieData);
  });

  it('should handle rejection while getting all movies', function() {

    var title = 'some: title';

  	// mock the omdbFactory
  	spyOn(omdbFactory, 'getDetails').and.callFake(function() {
  		var deferred = $q.defer();
  		deferred.reject(errResponse);
  		return deferred.promise;
  	});

    $cacheFactory.get('mooVCache').put('title', title);
  	$controller('detailsCtrl', { $scope: $scope });

  	$httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);
  	$rootScope.$apply(); // resolve/reject
    $httpBackend.flush();

  	expect($scope.detailsError).toBe(errResponse);
    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should get movie details', function() {
    
    var title = 'Some series: sequel id';

    // mock the omdbFactory
    spyOn(omdbFactory, 'getDetails').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve(movieDetails);
      return deferred.promise;
    });

    // note that if/because the movie details are requested on page load,
    // no explicit call to the omdbFactory needs to be made here, 
    // and the title is passed in via $cacheFactory

    $cacheFactory.get('mooVCache').put('title', title);
    $controller('detailsCtrl', { $scope: $scope });

    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);

    $rootScope.$apply(); // resolve the promise
    $httpBackend.flush();

    expect($scope.details).toEqual(movieDetails.data);
    expect(omdbFactory.getDetails).toHaveBeenCalledWith(title);

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
  
});