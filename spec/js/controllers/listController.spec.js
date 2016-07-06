
describe('List controller', function() {
  
  var movieData = [
    {"id":2,"title":"High Noon","active":true},
    {"id":3,"title":"The Big Country","active":true},
    {"id":8,"title":"Key Largo","active":true},
    {"id":9,"title":"Casablanca","active":true},
    {"id":10,"title":"Fiddler on the Roof","active":true},
    {"id":4,"title":"The Sound of Music","active":true},
    {"id":11,"title":"The Treasure of the Sierra Madre","active":true},
    {"id":5,"title":"Expelled: No Intelligence Allowed","active":true},
    {"id":12,"title":"Life Is Beautiful","active":true},
    {"id":13,"title":"El mariachi","active":true}
  ];
  var removedMovieData = {"id":13,"title":"Jaws","active":false};
  var $httpBackend;
  var myMoviesFactory;
  var $q;
  var myMoviesUrl;
  var $rootScope;
  var $scope;
  var $controller;
  var $state;
  var $cacheFactory;

  beforeEach(angular.mock.module('movie-list'));

  beforeEach(angular.mock.inject(function($injector) {
    $httpBackend = $injector.get('$httpBackend');
    $q = $injector.get('$q');
    myMoviesFactory = $injector.get('myMoviesFactory');
    myMoviesUrl = $injector.get('myMoviesUrl');
    myMoviesUrlFallback01 = $injector.get('myMoviesUrlFallback01');
    $rootScope = $injector.get('$rootScope');
    $controller = $injector.get('$controller');
    $state = $injector.get('$state');
    $cacheFactory = $injector.get('$cacheFactory');
  }));

  beforeEach(function() {
    $scope = {};
  });

  it('should set the title in cache before going to movie-details', function() {

    var title = "Some never-before-heard-of movie"; 
    $controller('listCtrl', { $scope: $scope });
    $scope.movieDetails(title); // save title then navigate

    // check that title was saved
    expect($cacheFactory.get('mooVCache').get('title')).toEqual(title);
  });

  it('should go to the movie-details page', function() {

    spyOn($state, 'go');
    $controller('listCtrl', { $scope: $scope });
    $scope.movieDetails('Some title');
    expect($state.go).toHaveBeenCalledWith('movie-details');
  });

  it('should handle rejection when removing a movie', function() {

    var title = "Expelled: No Intelligence Allowed";
    var errMsg = "Couldn't remove movie on the first try.";

    // mock the myMoviesFactory
    spyOn(myMoviesFactory, 'removeTitle').and.callFake(function() {
      var deferred = $q.defer();
      deferred.reject();
      return deferred.promise;
    });

    $httpBackend.expect('GET', myMoviesUrl).respond(200, errMsg);
    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);

    $controller('listCtrl', { $scope: $scope });

    $scope.removeMovie(title);

    $rootScope.$apply();
    $httpBackend.flush();

    expect(myMoviesFactory.removeTitle).toHaveBeenCalledWith(title, myMoviesUrl);
    expect(myMoviesFactory.removeTitle).toHaveBeenCalledWith(title, myMoviesUrlFallback01);

    $httpBackend.verifyNoOutstandingExpectation();
  });

  it('should remove a movie', function() {

    var title = "The: Sound of Music";

    // mock the myMoviesFactory
    spyOn(myMoviesFactory, 'removeTitle').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve(removedMovieData);
      return deferred.promise;
    });

    $httpBackend.expect('GET', myMoviesUrl).respond(200, removedMovieData);
    $httpBackend.expect('GET', myMoviesUrl).respond(200, removedMovieData);
    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);

    $controller('listCtrl', { $scope: $scope });

    $scope.removeMovie(title);

    $rootScope.$apply();
    $httpBackend.flush();

    expect(myMoviesFactory.removeTitle).toHaveBeenCalledWith(title, myMoviesUrl);

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should handle rejection when getting the movie list', function() {

    // setup to reject
    var errMsg = "Couldn't get movies on the first try"
    spyOn(myMoviesFactory, 'getMyMovies').and.callFake(function() {
      var deferred = $q.defer();
      deferred.reject(errMsg);
      return deferred.promise;
    });
    
    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);

    $controller('listCtrl', { $scope: $scope });

    $scope.getMovies();

    $httpBackend.flush();

    expect($scope.errored).toEqual(true);
    expect($scope.status).toEqual("Couldn't get Karl's movies. His server isn't functioning or he hasn't added any movies yet.");
    expect($scope.errorDetail).toEqual(errMsg);
    expect($scope.movies).toBeUndefined();

    // test the promise chain
    expect(myMoviesFactory.getMyMovies).toHaveBeenCalledWith(myMoviesUrl);
    expect(myMoviesFactory.getMyMovies).toHaveBeenCalledWith(myMoviesUrlFallback01);

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should get the movie list', function () {
    
    // mock the myMoviesFactory

    spyOn(myMoviesFactory, 'getMyMovies').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve(movieData);
      return deferred.promise;
    });

    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);
    $httpBackend.expect('GET', myMoviesUrl)
      .respond(200, movieData);

    $controller('listCtrl', { $scope: $scope });

    $scope.getMovies();

    $rootScope.$apply();

    expect($scope.movies).toEqual(movieData);
  });

});