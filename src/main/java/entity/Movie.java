package entity;

import javax.persistence.Entity;
import javax.persistence.Column;
import javax.persistence.GeneratedValue;
import javax.persistence.GenerationType;
import javax.persistence.Id;

@Entity
public class Movie {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Long id;

	@Column(nullable = false, unique = true)
	private String title;

	private boolean isActive;

	public Movie() {
		this.setActive(true);
	}

	public Movie(String title) {
		this();
		this.title = title;
	}

	public Movie(Long id, String title) {
		this(title);
		this.id = id;
	}

	public Long getId() {
		return this.id;
	}
	public void setId(Long id) {
		this.id = id;
	}

	public String getTitle() {
		return this.title;
	}
	public void setTitle(String title) {
		this.title = title;
	}

	public void setActive(boolean setActive) {
		this.isActive = setActive;
	}
	public boolean isActive() {
		return this.isActive;
	}
}