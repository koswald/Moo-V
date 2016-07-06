package config;

import javax.servlet.http.HttpServletRequest;
import javax.servlet.http.HttpServletResponse;

import org.springframework.http.HttpHeaders;
import org.springframework.web.servlet.handler.HandlerInterceptorAdapter;


import utility.Filx;

public class CorsInterceptor extends HandlerInterceptorAdapter {

	@Override
	public boolean preHandle(HttpServletRequest request, HttpServletResponse response, Object handler) throws Exception {

		String method = request.getHeader(HttpHeaders.ACCESS_CONTROL_REQUEST_METHOD);
		
		if (null != method) {
			
			// an Access-Control-Request-Method header was specified, so 
			// this can be considered to be a "preflight" request, 
			// even though http method OPTIONS requests are handled elsewhere
			
			String preHandler = "org.springframework.web.servlet.handler.AbstractHandlerMapping$PreFlightHandler";
			boolean preflight = handler.toString().indexOf(preHandler) > -1;
			
			String origin = request.getHeader(HttpHeaders.ORIGIN);
			
			Filx.log("CorsInterceptor.preHandle: This is a non-standard request", null);
			Filx.log(String.format("preflight handler invoked: %b", preflight));
			Filx.log(String.format("requested method: %s", method));
			Filx.log(String.format("url: %s", request.getRequestURL().toString()));
			
			// CORS-validate the origin
			
			if (CorsValidator.isValid(origin)) {
				response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_ORIGIN, origin);
				Filx.log("origin validation: pass");
			} else {
				Filx.log("origin validation: fail");
			}

			// if the requested method is specified in AppConfig, 
			// set the requested method header as the allowed method
			
			if (AppConfig.allowedMethods.contains(method)) {
				response.setHeader(HttpHeaders.ACCESS_CONTROL_ALLOW_METHODS, method);
				Filx.log("method validation: pass");
			} else {
				Filx.log("method validation: fail");
			}
			
		}
		return true;
	}

}
