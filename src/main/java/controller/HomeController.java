package controller;

import service.MovieService;
import repo.MovieRepository;

import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.http.MediaType;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;

import javax.inject.Inject;

@RestController
public class HomeController {
	
	@Inject
	private MovieRepository repo;
	
    @RequestMapping(value = "/movies", method = RequestMethod.GET, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> findAll(
    		@RequestHeader(value = HttpHeaders.ORIGIN, required = false) String origin) {

    	return new MovieService(repo).findAll(origin);
    }
	
	@RequestMapping(value = "/movies/{title}", method = RequestMethod.POST, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> create(@PathVariable String title, @RequestHeader(value = HttpHeaders.ORIGIN, required = false) String origin) {

		return new MovieService(repo).addMovie(title, origin);
	}

    @RequestMapping(value = "/movies/{title}/delete", method = RequestMethod.DELETE, produces = MediaType.APPLICATION_JSON_VALUE)
    public ResponseEntity<Object> deactivate(
    		@PathVariable String title, 
    		@RequestHeader(value = HttpHeaders.ORIGIN, required = false) String origin) {

    	return new MovieService(repo).deactivateMovie(title, origin);
    }
}
