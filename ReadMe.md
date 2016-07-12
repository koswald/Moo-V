#### ReadMe.md Contents

- [Project description](#project-description)
- [Installation procedure](#installation-procedure)
- [Open the project in Eclipse](#open1)
- [Run the back end server from Eclipse](#run1)
- [Run the back end server from IntelliJ](#run2)
- [Once you are satisfied with the back-end model](#once)
- [Unit Tests](#unit-tests)
- [Troubleshooting](#troubleshooting)
- [Links and Credits](#links-and-credits)

# Project description

This web app searches http://omdbapi.com for movie data and if desired adds a movie (title) to a local database.

The front end and back end code are in the same project folder but run on different servers. No IDE was used in development, except that the JUnit tests were written and run in Eclipse. Front-end tests are run from the command line (see below).

**Front-end details:** AngularJS (focus), angular-ui-router, grunt, bootstrap.css, jasmine with karma test runner. No bootstrap.js, so no jQuery. All dependencies are installed with npm.

**Back-end details:** Spring-boot, java, maven, hibernate, PostgreSQL. Spring-boot starts a Tomcat server and is run from the command line. 

# Installation procedure

Install [PostgreSQL](https://www.postgresql.org/download/). Version 9.4 or later is recommended; recommended username and port: postgres and 5432. When the install is complete, the Stack Builder install will start automatically and you can Cancel out of it.

Create a database from a console window

	cd "C:\Program Files\PostgreSQL\9.4\bin"
	createdb -h localhost -p 5432 -U postgres karls-movie-db

If values above are changed, it will be necessary later to modify one or both of
- [pom.xml]
- [application.properties]

Clone the project.

If you have a newish computer configuration, you may need to install [Node.js], [Java][] [8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) **JDK**, and [Maven]. The Maven binary zip archive is typically a good choice for Windows users. 

After installing Java, you will need to set the user environment variable JAVA_HOME to something like `C:\Program Files\Java\jdk1.8.0_91` (note the lack of \bin at the end); and append ;%JAVA_HOME%\bin to the system environment variable PATH (with %JAVA_HOME% expanded to its actual value).

After extracting the Maven binaries, add the Maven bin folder to the system environment variable Path, something like `C:\tools\apache-maven-3.3.9\bin`.

Open a console window at the project folder (the folder with package.json).

Compile and run the java files to start the back end server with the following command. The first time you run it, it will take a while for Maven to download the dependencies.

	mvn spring-boot:run

From another console open at the same folder, run the following global installs.

	npm i -g jasmine
	npm i -g karma-cli
	npm i -g grunt

Running the following command installs the dependencies specified in package.json

	npm i

Start the front end server 

	grunt

To test the installation, open a browser to [http://localhost:9000/src](http://localhost:9000/src)

The front-end port can be changed in [Gruntfile.js](Gruntfile.js).

> Note: The back-end port is hardcoded in three locations: 
> [AppConfig.java](src\main\java\config\AppConfig.java), 
> [myMoviesUrl.js](src\js\values\myMoviesUrl.js), and 
> [myMoviesUrlFallback.js](src\js\values\myMoviesUrlFallback01.js).

# Open the project in Eclipse <a name="open1"></a>

- Move or copy the project to the Eclipse workspace, or create a new workspace in the project's parent folder (slower).
- In the Eclipse File menu, select Import ... | General | Existing Projects into Workspace | select the omdb project folder | Finish.

# Run the back end server from Eclipse <a name="run1"></a>

Right click the project in the Eclipse's Project Explorer and select Run As | Maven build... | enter `spring-boot:run` in the goals field | click Run.

# Run the back end server from IntelliJ <a name="run2"></a>

From the Run menu, click Edit Configurations ... | click Maven on left | click the + button | click Maven on the left (again) | in the Name field give the configuration a name, like "omdb back end" | in the Command line field, type `spring-boot:run` (leave out the `mvn`) | click OK.

# Once you are satisfied with the back-end model <a name="once"></a>

At some point, when changing to a more production-like environment, and when the back-end model is stable, it will be desirable to change the file `application.properties`'s value `spring.jpa.hibernate.ddl-auto` from `create-drop` to `validate` or to `update`, so that the database table is not dropped and recreated whenever the back-end server is stopped and restarted. 

Before changing this this setting,

- End-task the java.exe process while the back-end server is running (it may be javaw.exe if running from Eclipse), to prevent the table from being dropped.
- Add `application.properties` to `.git\info\exclude`
- Run the git command `git update-index --assume-unchanged src/main/resources/application.properties`
- Now [application.properties] can be changed, and the changes will be ignored by Git.

To revert,

- Comment out `application.properties` in `.git\info\exclude` by beginning the line with a `#`, or delete it.
- Use the git command above but with `--no-assume-unchanged`.

In [application.properties], change `create-drop` to `validate` or `update`:
```
spring.jpa.hibernate.ddl-auto=create-drop
```

# Unit Tests

Back-end junit tests are not setup for running from the command line. They have been run in Eclipse and IntelliJ.

Front-end tests can be run by opening SpecRunner.html or by running either of these commands:

	npm test
	karma start

**One advantage to using the karma test runner** is that tests are automatically rerun on file changes. The karma tests are set up to use the headless browser PhantomJS for speed, but Chrome can easily be added to the mix by modifying the karma.config.js browser array. For more browser launchers, visit [https://www.npmjs.com/browse/keyword/karma-launcher]().

**Another advantage** of using karma is that it has been configured for coverage. After running the tests, the coverage reports can be accessed from `\coverage\<browser (OS)>\index.html`.

# Troubleshooting

Hibernate error: If you get the following error when starting the back-end server, "Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaAutoConfiguration.class]: Invocation of init method failed; nested exception is org.hibernate.HibernateException: Missing table: movie -> [Help 1]", make sure that the application.properties value `spring.jpa.hibernate.ddl-auto` is set to `create-drop`.

# Links and Credits

The [OMDB API] provides the movie data to make things interesting.

The Bradley Braithwaite [Pluralsight tutorial] on AngularJS testing was very helpful.

The [Spring Boot getting started document] was a *must*.

The backend java leverages [another GitHub project].

An online [markdown editor] was used to create this file. Here is [a basic markdown primer].

[//]: # (any or all of the following references could have be placed anywhere in this file; note that surrounding the url with angle brackets is optional)

[Node.js]: https://nodejs.org/en/download/current/
[Java]: http://www.java.com
[Maven]: http://maven.apache.org/
[pom.xml]: pom.xml
[application.properties]: src/main/resources/application.properties "view the whole file"
[markdown editor]: <http://dillinger.io> "dillinger.io is an online markdown editor that can save to and import from your Dropbox or OneDrive"
[pluralsight tutorial]: <https://app.pluralsight.com/library/courses/angularjs-ngmock-unit-testing>
[omdb api]: <http://omdbapi.com>
[spring boot getting started document]: <http://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#getting-started-installing-spring-boot>
[another GitHub project]: <https://github.com/AlgiersJUG/spring-boot-postgres-sample>
[same-file link]: http://stackoverflow.com/questions/6695439/how-do-you-create-link-to-a-named-anchor-in-multimarkdown
[a basic markdown primer]: http://docs.gitlab.com/ee/markdown/markdown.html

<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
