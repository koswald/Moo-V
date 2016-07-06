describe('OMDB Factory', function() {

  var movieData = {Title: "One Fine Day", Year: "1996", Rated: "PG", Released: "20 Dec 1996"};
  var $httpBackend;
  var omdbFactory;
  var baseUrl = 'http://www.omdbapi.com/';
  var SpecRunner = true;

  beforeEach(angular.mock.module('movie-list'));

  beforeEach(angular.mock.inject(function($injector) {
     $httpBackend = $injector.get('$httpBackend');
     omdbFactory = $injector.get('omdbFactory');
  }));

  afterEach(function() {
  	$httpBackend.verifyNoOutstandingRequest();
  	$httpBackend.verifyNoOutstandingExpectation();
  });

  it('should get a movie summary', function() {

  	var response;
    var title = "High: Noon";
  	var expectedUrl = baseUrl + "?t=" + encodeURIComponent(title);

    $httpBackend.expect('GET', expectedUrl)
    	.respond(200, movieData);

    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);

    omdbFactory.getSummary(title)
    	.then(function(data) {
    		angular.mock.dump(data);
    		response = data;
    	});
    $httpBackend.flush();
    expect(response.data).toEqual(movieData);
  });

  it('should return movie details', function () {
    
    var response;
    var title = 'Expelled: No Intelligence Allowed'; // adding a colon required changes how the encoding of the title was handled, compared to tests written so far
    var expectedUrl = baseUrl + "?t=" + encodeURIComponent(title) + '&plot=full&tomatoes=true';

    $httpBackend.expect('GET', expectedUrl)
      .respond(200, movieData);

    $httpBackend.expect('GET', 'views/search-results.tpl.html').respond(200);

    omdbFactory.getDetails(title)
      .then(function(data) {
        response = data;
      });
    $httpBackend.flush();
    expect(response.data).toEqual(movieData);
  });

});