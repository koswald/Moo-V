
describe('Results controller', function() {

  var resultsCtrl;
  var omdbFactory;
  var $controller;
  var $scope;
  var $q;
  var $rootScope;
  var $location;
  var $httpBackend;
  var summaryData = { data: { Title: "Groundhog Day", Response: "True", Year: "1993", Rated: "PG", Released: "12 Feb 1993", Runtime: "101 min" }};
  var baseUrl = "http://www.omdbapi.com";

  beforeEach(angular.mock.module('movie-list'));

  beforeEach(angular.mock.inject(function($injector) {
    $cacheFactory = $injector.get('$cacheFactory');
    $controller = $injector.get('$controller');
    $scope = {};
    $q = $injector.get('$q');
    $rootScope = $injector.get('$rootScope');
    $location = $injector.get('$location');
    omdbFactory = $injector.get('omdbFactory');
    omdbUrl = $injector.get('omdbUrl');
    $httpBackend = $injector.get('$httpBackend');
  }));

  it('should scroll', function() {

    var $window;
    angular.mock.inject(function($injector) {
      $window = $injector.get('$window');
    });
    
    spyOn($window, 'scrollBy');
    $controller('resultsCtrl', { $scope: $scope });
    $scope.results.scrollDown();
    expect($window.scrollBy).toHaveBeenCalledWith(0, 300);
  });

  it('should navigate to the movie-details page/state', function() {

    var $state;
    inject(function($injector) {
      $state = $injector.get('$state');
    });

    spyOn($state, 'go');
    $controller('resultsCtrl', { $scope: $scope, $state: $state });
    $scope.results.movieDetails(); // click handler initiates navigation

    expect($state.go).toHaveBeenCalledWith('movie-details');
  });

  it('should handle rejection when getting a summary', function() {

    var title = "El mariachi";
    var errMsg = "Couldn't get the summary";
    // mock the omdbFactory
    spyOn(omdbFactory, 'getSummary').and.callFake(function() {
      var deferred = $q.defer();
      deferred.reject(errMsg);
      return deferred.promise;
    });

    var expectedUrl = omdbUrl + '/?t=' + encodeURIComponent(title);
    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);
    $httpBackend.expect('GET', expectedUrl).respond(500);

    $cacheFactory.get('mooVCache').put('title', title);
    $controller('resultsCtrl', { $scope: $scope });
    $rootScope.$apply(); // resolve the promise
//    $httpBackend.flush();

    expect(omdbFactory.getSummary).toHaveBeenCalled();
  });

  it('should get the title from the cache', function() {
    
    var title = 'Superman';

    $cacheFactory.get('mooVCache').put('title', title);
    $controller('resultsCtrl', { $scope: $scope });

    expect($scope.results.title).toEqual(title);
  });

  it('should load movie summary', function() {

    var title = 'Some series: sequel id';

    // mock the omdbFactory
    spyOn(omdbFactory, 'getSummary').and.callFake(function() {
      var deferred = $q.defer();
      deferred.resolve(summaryData);
      return deferred.promise;
    });

    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);
    $httpBackend.expect('GET', 'views/search-results.list.tpl.html').respond(200);
    $controller('resultsCtrl', { $scope: $scope });
    $scope.results.title = title;
    
    $scope.results.searchSubmit();
    $rootScope.$apply(); // resolve the promise
    $httpBackend.flush();

    expect($scope.omdb.movies).toBe(summaryData.data);
    expect(omdbFactory.getSummary).toHaveBeenCalledWith(title);

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });

  it('should use the right url', function() {
    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);
    $httpBackend.flush();

    expect(omdbUrl).toEqual(baseUrl);

    $httpBackend.verifyNoOutstandingExpectation();
    $httpBackend.verifyNoOutstandingRequest();
  });
});