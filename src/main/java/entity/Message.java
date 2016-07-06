package entity;

import org.springframework.http.HttpStatus;
import config.AppConfig;

public class Message {

	private String msg;
	private HttpStatus statusText;

	public Message() {

		this.msg = null;
		this.statusText = null;
	}
	public Message(String msg) {

		this();
		this.msg = msg;
		if (msg == AppConfig.ORIGIN_HEADER_INVALID) {
			this.setStatusText(HttpStatus.FORBIDDEN);

		} else if (msg == AppConfig.MOVIE_ALREADY_EXISTS) {
			this.setStatusText(HttpStatus.CONFLICT);

		} else if (msg == AppConfig.MOVIE_NOT_FOUND) {
			this.setStatusText(HttpStatus.NOT_FOUND);
		}
	}
	public String getMessage() {

		return this.msg;
	}
	public Message setMessage(String msg) {

		this.msg = msg;
		return this;
	}
	public HttpStatus getStatusText () {

		return this.statusText;
	}
	public Message setStatusText (HttpStatus statusText) {

		this.statusText = statusText;
		return this;
	}
}