package service;

import java.util.ArrayList;
import java.util.List;

import static org.mockito.Mockito.when;
import static org.mockito.Mockito.mock;
import static org.junit.Assert.assertTrue;
import static org.mockito.Mockito.any;

import org.junit.Before;
import org.junit.BeforeClass;
import org.junit.Test;
import org.springframework.http.ResponseEntity;

import config.AppConfig;
import entity.Message;
import entity.Movie;
import repo.MovieRepository;

public class MovieService_Test {
	
	private MovieService service;
	private Movie movie1, movie2, movie3;
	private Long id1, id2, id3;
	private String title1, title2, title3;
	private List<Movie> movies;
	private List<Movie> responseMovies;
	private Message responseMessage;
	private MovieRepository mockRepo;
	private String origin;
	private String badOrigin;
	private ResponseEntity<Object> response;
	
	@BeforeClass
	public static void setUpOnce() {
		new AppConfig(); // compile regex patterns for CORS
	}
	
	@Before
	public void setUp() {
		
		// instantiate two movies and the movies ArrayList
		// prepare to instantiate a third movie if necessary
		// instantiate the class under test, MovieService, with a mock repo
		
		origin = "http://karl.moo-v-fans.com";
		badOrigin = "http://maliciousOrigin.com";
		title1 = "High Noon";
		title2 = "The Good, the Bad, and the Ugly";
		title3 = "The Big Country";
		id1 = 1L;
		id2 = 2L;
		id3 = 3L;
		movie1 = new Movie(id1, title1);
		movie2 = new Movie(id2, title2);
		movies = new ArrayList<Movie>();
		movies.add(movie1);
		movies.add(movie2);
		
		mockRepo = mock(MovieRepository.class);
		service = new MovieService(mockRepo);
	}
	
	// should deactivate a movie
	@SuppressWarnings("unchecked")
	@Test 
	public void deactivateMovie() {
		when(mockRepo.findAll()).thenReturn(movies);
		when(mockRepo.save(any(Movie.class))).thenReturn(null);
		
		response = service.deactivateMovie(title2, origin); // call the method under test
		responseMovies = (List<Movie>) response.getBody(); // extract the movies from the ResponseEntity
		
		assertTrue(responseMovies.size() == 1); // should return a single movie
		assertTrue(responseMovies.get(0).getTitle() == title2); // should return the movie that was deactivated
		assertTrue(responseMovies.get(0).isActive() == false); // should return a deactivated movie
	}
	// should add a movie
	@SuppressWarnings("unchecked")
	@Test 
	public void addMovie () {
		when(mockRepo.findAll()).thenReturn(movies);
		when(mockRepo.save(any(Movie.class))).thenReturn(null);

		response = service.addMovie(title3, origin); // call the method under test
		responseMovies = (List<Movie>) response.getBody(); // extract the movies from the ResponseEntity

		assertTrue(responseMovies.size() == 1); // should return a single movie
		assertTrue(responseMovies.get(0).getTitle() == title3); // should return the movie that was added
		assertTrue(responseMovies.get(0).isActive() == true); // should return an active movie
	}
	// should find all movies
	@SuppressWarnings("unchecked")
	@Test 
	public void findAll() {
		when(mockRepo.findAll()).thenReturn(movies);
		
		response = service.findAll(origin); // call the method under test
		responseMovies = (List<Movie>) response.getBody(); // extract the movies from the ResponseEntity
		
		assertTrue(responseMovies.get(0) == movies.get(0)); // should return an ArrayList with the expected movies
		assertTrue(responseMovies.get(1) == movies.get(1)); // should return an ArrayList with the expected movies
		assertTrue(responseMovies.size() == movies.size()); // should return an ArrayList of the expected size
		assertTrue(responseMovies.size() == 2); // should return an ArrayList of the expected size
	}
	// should activate an inactive movie
	@SuppressWarnings("unchecked")
	@Test
	public void activateMovie () {
		// setup a mock repo with an inactive movie
		movie3 = new Movie(id3, title3);
		movie3.setActive(false);
		movies.add(movie3);
		when(mockRepo.findAll()).thenReturn(movies);
		
		response = service.addMovie(title3, origin); // call the method under test
		responseMovies = (List<Movie>) response.getBody(); // extract the movies from the ResponseEntity
		
		assertTrue(responseMovies.size() == 1); // should return a single movie
		assertTrue(responseMovies.get(0).getTitle() == title3); // should return the movie that was activated
		assertTrue(responseMovies.get(0).isActive() == true); // should return an active movie
	}
	// should return 404 deactivating an inactive movie
	@Test
	public void deactivateInactiveMovie() {
		// setup the mock repo with an inactive movie
		movies.get(1).setActive(false);;
		when(mockRepo.findAll()).thenReturn(movies);
		
		response = service.deactivateMovie(title2, origin); // call the method under test
		responseMessage = (Message) response.getBody(); // extract message from ResponseEntity
		
		assertTrue(responseMessage.getMessage().equals(AppConfig.MOVIE_NOT_FOUND)); // should return 404
		
	}
	// should not return inactive movies
	@SuppressWarnings("unchecked")
	@Test
	public void getOnlyActiveMovies() {
		// setup the mock repository
		movies.get(1).setActive(false);
		when(mockRepo.findAll()).thenReturn(movies);
		assertTrue(movies.size() == 2); // verify that the mock repo has two movies
		
		response = service.findAll(origin); // call the method under test
		responseMovies = (List<Movie>) response.getBody(); // extract movies from the ResponseEntity
		
		assertTrue(responseMovies.size() == 1); // should return ArrayList of the expected size
	}
	// should not allow adding an existing movie
	@Test
	public void rejectExistingMovie () {
		when(mockRepo.findAll()).thenReturn(movies); // mock the repo
		
		response = service.addMovie(title2, origin); // call the method under test
		responseMessage = (Message) response.getBody(); // extract Message from the ResponseEntity
		
		assertTrue(responseMessage.getMessage() == AppConfig.MOVIE_ALREADY_EXISTS); // should return the appropriate error
	}
	// should reject a request with an unauthorized origin (findAll)
	@Test
	public void rejectBadOriginOnFindAll() {
		when(mockRepo.findAll()).thenReturn(movies); // mock the repo
		
		response = service.findAll(badOrigin); // call the method under test
		responseMessage = (Message) response.getBody(); // extract Message from the ResponseEntity
		
		assertTrue(responseMessage.getMessage() == AppConfig.ORIGIN_HEADER_INVALID);
	}
	// should reject a request with an unauthorized origin (deactivateMovie)
	@Test
	public void rejectBadOriginOnDeactivate() {
		when(mockRepo.findAll()).thenReturn(movies); // mock the repo
		
		response = service.deactivateMovie(title1, badOrigin); // call the method under test
		responseMessage = (Message) response.getBody(); // extract Message from the ResponseEntity
		
		assertTrue(responseMessage.getMessage() == AppConfig.ORIGIN_HEADER_INVALID);
	}
	// should reject a request with an unauthorized origin (addMovie)
	@Test
	public void rejectBadOriginOnAdd() {
		when(mockRepo.findAll()).thenReturn(movies); // mock the repo
		
		response = service.addMovie(title3, badOrigin); // call the method under test
		responseMessage = (Message) response.getBody(); // extract Message from the ResponseEntity
		
		assertTrue(responseMessage.getMessage() == AppConfig.ORIGIN_HEADER_INVALID);
	}

}