package service;

import java.util.ArrayList;
import java.util.List;
import java.util.function.Consumer;

import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import config.AppConfig;
import config.CorsValidator;
import entity.Message;
import entity.Movie;
import repo.MovieRepository;

public class MovieService {

	private MovieRepository movieRepository;
	
	public MovieService(MovieRepository repo) {
		this.movieRepository = repo;
	}
	
	// get all active movies
	
	public ResponseEntity<Object> findAll(String origin) {
       
        if (!CorsValidator.isValid(origin)) return InvalidOriginResponse(); // validate CORS
        
        HttpHeaders headers = getDefaultHeaders();
        headers.setAccessControlAllowOrigin(origin); // echo the actual origin as the allowed origin
        
        final List<Movie> resultList = new ArrayList<Movie>();
        final Iterable<Movie> all = this.movieRepository.findAll();

        all.forEach(new Consumer<Movie>() {
            @Override
            public void accept(Movie movie) {
                if (movie.isActive()) {
                    resultList.add(movie);
                }
            }
        });
        return new ResponseEntity<Object>(resultList, headers, HttpStatus.OK);
	}
    
	// deactivate movie
	
    public ResponseEntity<Object> deactivateMovie(String title, String origin) {
    	
        if (!CorsValidator.isValid(origin)) return InvalidOriginResponse(); // short circuit on invalid CORS

        HttpHeaders headers = getDefaultHeaders();
        headers.setAccessControlAllowOrigin(origin); // echo the actual origin as the allowed origin

        final List<Movie> resultList = new ArrayList<Movie>();
        final Iterable<Movie> all = this.movieRepository.findAll();
        final String finalTitle = title;

        all.forEach(new Consumer<Movie>() {
            @Override
            public void accept(Movie movie) {
                if (movie.getTitle().equals(finalTitle) && movie.isActive()) {

                    // deactivate
                	
                    movie.setActive(false);
                    movieRepository.save(movie);
                    resultList.add(movie);
                }
            }
        });
        if (resultList.size() == 0) {
            return MovieNotFoundResponse(headers);
        }
        return new ResponseEntity<Object>(resultList, headers, HttpStatus.ACCEPTED);    	
    }
    
    // add movie
    
    public ResponseEntity<Object> addMovie(String title, String origin) {
    	
        if (!CorsValidator.isValid(origin)) return InvalidOriginResponse(); // validate CORS
        
        HttpHeaders headers = getDefaultHeaders();
        headers.setAccessControlAllowOrigin(origin); // echo the actual origin as the allowed origin

        // iterate through the movies, 
        // checking for uniqueness and active status
        
        final List<Movie> resultList = new ArrayList<Movie>();
        final List<String> msgList = new ArrayList<String>();
        final Iterable<Movie> all = movieRepository.findAll();
        final String finalTitle = title;

        all.forEach(new Consumer<Movie>() {
            @Override
            public void accept(Movie movie) {
                if (movie.getTitle().equals(finalTitle) && (!movie.isActive())) {

                    // title matches, but the movie is inactive, so
                    // activate it
                	
                    movie.setActive(true);
                    movieRepository.save(movie);
                    resultList.add(movie);
                } else if (movie.getTitle().equals(finalTitle)) {

                    // title matches and movie is active, so
                    // add an error message
                	
                    msgList.add(AppConfig.MOVIE_ALREADY_EXISTS);
                }
            }
        });
        if (msgList.contains(AppConfig.MOVIE_ALREADY_EXISTS)) {

            // title is not unique, so send an error message
        	
            return MovieAlreadyExistsResponse(headers);

        } else if (resultList.size() == 0) {

            // title is unique and hasn't yet been added, so 
            // create a new movie
        	
            Movie movie = new Movie();
            movie.setTitle(title);
            movieRepository.save(movie);
            resultList.add(movie);
        }
        return new ResponseEntity<Object>(resultList, headers, HttpStatus.CREATED);
    }

    // standard responses
    
    private ResponseEntity<Object> MovieAlreadyExistsResponse(HttpHeaders headers) {
            return new ResponseEntity<Object>(new Message(AppConfig.MOVIE_ALREADY_EXISTS), headers, HttpStatus.CONFLICT);    
    }
    private ResponseEntity<Object> InvalidOriginResponse() {
        return new ResponseEntity<Object>(new Message(AppConfig.ORIGIN_HEADER_INVALID), this.getDefaultHeaders(), HttpStatus.FORBIDDEN);
    }
    private ResponseEntity<Object> MovieNotFoundResponse(HttpHeaders headers) {
        return new ResponseEntity<Object>(new Message(AppConfig.MOVIE_NOT_FOUND), headers, HttpStatus.NOT_FOUND);
    }

    private HttpHeaders getDefaultHeaders() {
        return addCORSHeaders(new HttpHeaders());
    }

    private HttpHeaders addCORSHeaders(HttpHeaders headers) {
        if (AppConfig.exposeAllowedOrigins) {
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, AppConfig.ACCESS_CONTROL_ALLOW_ORIGIN);
        } else {
            headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, null);
        }
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_HEADERS, AppConfig.ACCESS_CONTROL_ALLOW_HEADERS);
        headers.add(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, AppConfig.ACCESS_CONTROL_ALLOW_METHODS);
        headers.add(HttpHeaders.ACCESS_CONTROL_MAX_AGE, AppConfig.ACCESS_CONTROL_MAX_AGE);
        headers.add(HttpHeaders.VARY, AppConfig.VARY);
        return headers;
    }
	
}
