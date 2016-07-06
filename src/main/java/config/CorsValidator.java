package config;

import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class CorsValidator {

    // Cross Origin Resource Sharing (CORS) origin validation

    public static boolean isValid(String origin) {

        // CORS can't be validated without an origin header
    	
        if (null == origin) return false;

        Matcher matcher = null;

        // iterate through precompiled regex patterns
        
        for (Pattern allowedOriginPattern : AppConfig.allowedOriginPatterns) {
            matcher = allowedOriginPattern.matcher(origin);
            if (matcher.matches()) {
            	
            	// validated OK
            	
                return true;  
            }
        }
        return false;
    }

}
