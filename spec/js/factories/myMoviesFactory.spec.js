
describe('My Movies Factory', function() {
  var allMoviesData = [
    {"id":1,"title":"Jaws","active":true},
    {"id":2,"title":"High Noon","active":true},
    {"id":3,"title":"The Big Country","active":true}
  ];
  var removedMovieData = [{"id":1,"title":"Jaws","active":false}];
  var addedMovieData = [{"id":1,"title":"Jaws","active":true}];
  var myMoviesFactory;
  var $httpBackend;
  var baseUrl = "http://localhost:5555/movies";

  beforeEach(angular.mock.module('movie-list'));

  beforeEach(angular.mock.inject(function($injector) {
    myMoviesFactory = $injector.get('myMoviesFactory');
    $httpBackend = $injector.get('$httpBackend');
  }));

  afterEach(function() {
    $httpBackend.verifyNoOutstandingExpectation(); // make sure that test fails when there are http calls without responses
    $httpBackend.verifyNoOutstandingRequest(); 
  });

  it('should add a movie', function() {

    var response; 
    var title = 'Fiddler on the Roof';
    var expectedUrl = baseUrl + '/' + encodeURIComponent(title);

    $httpBackend.expect('POST', expectedUrl)
      .respond(201, addedMovieData);

    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);

    myMoviesFactory.addTitle(title, baseUrl)
      .then(function(data) {
        response = data;
      });

    $httpBackend.flush();
    expect(response.data).toEqual(addedMovieData);
  });

  it('should remove a movie', function() {

    var response;
    var title = 'The Sound of Music';
    var expectedUrl = baseUrl + '/' + encodeURIComponent(title) + '/delete';

    $httpBackend.expect('DELETE', expectedUrl)
      .respond(202, removedMovieData);

    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);

    myMoviesFactory.removeTitle(title, baseUrl)
    .then(function(data) {
      response = data;
    });
    $httpBackend.flush();
    expect(response.data).toEqual(removedMovieData);
  });

  it('should return all movies', function() {

    var response;

    $httpBackend.expect('GET', baseUrl)
    	.respond(200, allMoviesData);

    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);

    myMoviesFactory.getMyMovies(baseUrl)
    	.then(function(data) {
    		response = data;
    	});
    $httpBackend.flush();
    expect(response.data).toEqual(allMoviesData);
  });

});