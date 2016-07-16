package config;

import org.springframework.context.annotation.ComponentScan;
import org.springframework.context.annotation.Configuration;
import java.util.List;
import java.util.ArrayList;
import java.util.regex.Pattern;

@Configuration
@ComponentScan
public class AppConfig {

	public static final int PORT = 5555;

	// header values
    public static final boolean exposeAllowedOrigins = true; // expose to client/requester
	public static final String ACCESS_CONTROL_ALLOW_ORIGIN = "http://localhost*, http://lap6*, http://192.168.1.*, http://karl.moo-v-fans*."; // ** can cross / boundary so use sparingly if ever; * and ? are supported too
	public static final String ACCESS_CONTROL_ALLOW_HEADERS = "origin, content-type, accept, x-requested-with";
	public static final String ACCESS_CONTROL_ALLOW_METHODS = "GET, POST, PUT, DELETE, OPTIONS, HEAD";
	public static final String ACCESS_CONTROL_MAX_AGE = "1209600"; // in seconds
	public static final String ACCESS_CONTROL_ALLOW_CREDENTIALS = "false";
	public static final String VARY = "Origin, Access-Control-Allow-Headers, Access-Control-Allow-Methods";
    public static final List<Pattern> allowedOriginPatterns = new ArrayList<Pattern>();
    public static final List<String> allowedMethods = new ArrayList<String>();
    
	// string constants
	public static final String MOVIE_ALREADY_EXISTS = "There is already a movie by that name.";
	public static final String ORIGIN_HEADER_INVALID = "The Origin header is absent or does not match the required value: Validation fails for Cross Origin Resource Sharing.";
	public static final String MOVIE_NOT_FOUND = "Movie not found.";

	public AppConfig() {
		this.deriveAllowedOriginPatterns();
		this.deriveAllowedMethods();
	}

	// Construct the ArrayList of allowed method strings
	
	private void deriveAllowedMethods() {
		String[] methods = ACCESS_CONTROL_ALLOW_METHODS.split(",");
		for (String method : methods) {
			allowedMethods.add(method.trim());
		}
	}
	
    // Construct the ArrayList of allowed-origin compiled regular expressions for faster responses

    private void deriveAllowedOriginPatterns() {

        String[] allowedOriginStrings = ACCESS_CONTROL_ALLOW_ORIGIN.split(",");

        for (String allowedOriginString : allowedOriginStrings) {

            // convert wildcards to a regular expression

            String allowedOriginRegExp = allowedOriginString
            				.trim() // trim whitespace
                            .replace("\\", "\\\\")   // escape \
                            .replace(".", "\\.")   //  escape . 
                            .replace("/", "\\/")   // escape /
                            .replace("**", ".+")   // ** can cross / or \ - use sparingly if ever
                            .replace("*", "[^\\\\\\/]*")  // * can't cross / or \  
                            .replace("+", "*") // change one or more to zero or more
                            .replace("?", ".{1}");   // ? represents a single char

            // add begin and end characters in order to match the whole origin not just part

            allowedOriginRegExp = String.format("^%s$", allowedOriginRegExp);

            // compile the regex and add it to the list

            allowedOriginPatterns.add(Pattern.compile(allowedOriginRegExp));
        }
    }
}