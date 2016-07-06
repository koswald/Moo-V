package server;

import org.junit.Test;
import org.springframework.boot.context.embedded.ConfigurableEmbeddedServletContainer;

import static org.mockito.Mockito.mock;
import static org.mockito.Mockito.verify;

import config.AppConfig;

public class ServerContainerCustomizer_Test {
		
	@Test
	public void verifySetPort() {
		ConfigurableEmbeddedServletContainer mockContainer = mock(ConfigurableEmbeddedServletContainer.class); // mock the container for the .customize method signature
		ServletContainerCustomizer customizer = new ServletContainerCustomizer(); // instantiate the class under test
		customizer.customize(mockContainer); // call the method under test
		verify(mockContainer).setPort(AppConfig.PORT); // verify that the .setPort method was called with the proper port
	}
	
}
