#### ReadMe.md Contents

- [Project description]
- [Installation procedure]
- [Open the project in Eclipse]
- [Run the back end server from Eclipse]
- [Run the back end server from IntelliJ]
- [Once you are satisfied with the back-end model]
- [Unit Tests]
- [Troubleshooting]
- [Links and Credits]

<a name="describe"> 

# Project description 

This web app searches http://omdbapi.com for movie data and if desired adds a movie (title) to a local database.

The front end and back end code share the same project folder but run on different servers. 

**Front-end details:** AngularJS (focus), angular-ui-router, Node.js, grunt, bootstrap.css, jasmine with karma test runner. No bootstrap.js, so no jQuery, except for Angular's native jqLite. All front-end dependencies are installed with npm (npm is included with the Node.js install).

**Back-end details:** Spring-boot, Java, Maven, Hibernate, PostgreSQL. Spring-boot uses Maven to install all back-end dependencies except PostgreSQL and Java.

<a id="setup">

# Installation procedure

Install [PostgreSQL](https://www.postgresql.org/download/). Version 9.4 or later is recommended; recommended username and port: postgres and 5432. When the install is complete, the Stack Builder install will start automatically and you can Cancel out of it. And here is an example of installing [postgres on ubuntu].

Create a database from a console window

	cd "C:\Program Files\PostgreSQL\9.4\bin"
	createdb -h localhost -p 5432 -U postgres karls-movie-db

> **Note:** The port (5432) and database name (karls-movie-db) 
> are hardcoded in [application.properties].

If you have a newish computer configuration, you may need to install [Node.js], [Java][] [8](http://www.oracle.com/technetwork/java/javase/downloads/index.html) **JDK**, and [Maven]. The Maven binary zip archive is typically a good choice for Windows users. 

After installing Java, you will need to set the user environment variable JAVA_HOME to something like `C:\Program Files\Java\jdk1.8.0_91` (note the lack of \bin at the end); and append ;%JAVA_HOME%\bin to the system environment variable PATH (with %JAVA_HOME% expanded to its actual value).

After extracting the Maven binaries, add the Maven bin folder to the system environment variable Path, something like `C:\tools\apache-maven-3.3.9\bin`.

----

##### Clone the project.

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

> **Note:** The back-end port is hardcoded in three locations: 
> [AppConfig.java], 
> [myMoviesUrl.js], and 
> [myMoviesUrlFallback.js].

<a id="open">

# Open the project in Eclipse 

- Move or copy the project to the Eclipse workspace, or create a new workspace in the project's parent folder (slower).
- In the Eclipse File menu, select Import ... | General | Existing Projects into Workspace | select the omdb project folder | Finish.

<a id="run">

# Run the back end server from Eclipse

Right click the project in the Eclipse's Project Explorer and select Run As | Maven build... | enter `spring-boot:run` in the goals field | click Run.

<a id="run2">

# Run the back end server from IntelliJ

From the Run menu, click Edit Configurations ... | click Maven on left | click the + button | click Maven on the left (again) | in the Name field give the configuration a name, like "omdb back end" | in the Command line field, type `spring-boot:run` (leave out the `mvn`) | click OK.

<a id="mod">

# Once you are satisfied with the back-end model

At some point, when the back-end model is stable, it will be desirable to change the setting that drops and recreates the database movie table every time the back-end server is stopped and restarted. 

Before changing this setting,

- End-task the java.exe process while the back-end server is running (it may be javaw.exe if running from Eclipse), to prevent the table from being dropped.
- Add `application.properties` to `.git\info\exclude`
- Run the git command `git update-index --assume-unchanged src/main/resources/application.properties`
- Now [application.properties] can be changed, and the changes will be ignored by Git.

To change the setting, in [application.properties], change `create-drop` to `validate` or `update`:
```
spring.jpa.hibernate.ddl-auto=create-drop
```

To revert the setting, if that should ever be necessary,

- Comment out `application.properties` in `.git\info\exclude` by beginning the line with a `#`, or delete it.
- Use the git command above but with `--no-assume-unchanged`.

<a id="test">

# Unit Tests

Back-end unit tests have been run in Eclipse and IntelliJ.

Front-end unit tests can be run by opening SpecRunner.html or from the command line with `npm test` or `karma start`.

**One advantage to using the karma test runner** is that tests are automatically rerun on file changes. The karma tests are set up to use the headless browser PhantomJS for speed, but Chrome can easily be added to the mix by modifying the karma.config.js browser array. For more browser launchers, visit https://www.npmjs.com/browse/keyword/karma-launcher.

**Another advantage** of using karma is that it has been configured for coverage. After running the tests, the coverage reports can be accessed from `\coverage\<browser (OS)>\index.html`.

<a id="fix">

# Troubleshooting

Hibernate error: If you get the following error when starting the back-end server

```
Error creating bean with name 'entityManagerFactory' defined in class path resource [org/springframework/boot/autoconfigure/orm/jpa/HibernateJpaAutoConfiguration.class]: Invocation of init method failed; nested exception is org.hibernate.HibernateException: Missing table: movie -> [Help 1]
```

make sure that the [application.properties] value `spring.jpa.hibernate.ddl-auto` is set to `create-drop`.

<a id="stroke">

# Links and Credits 

The [OMDB API] provides the movie data to make things interesting.

The Bradley Braithwaite [Pluralsight tutorial] on AngularJS testing was very helpful.

The [Spring Boot getting started document] was a *must*.

The backend java leverages [another GitHub project].

An online [markdown editor] was helpful at times. Here is a GitLab-flavored [markdown primer].

[//]: # (any or all of the following references could have be placed anywhere in this file; note that surrounding the url with angle brackets is optional)

[Node.js]: https://nodejs.org/en/download/current/
[Java]: http://www.java.com
[Maven]: http://maven.apache.org/
[postgres on ubuntu]: https://community.c9.io/t/setting-up-postgresql/1573
[pom.xml]: pom.xml
[application.properties]: src/main/resources/application.properties
[AppConfig.java]: src/main/java/config/AppConfig.java
[myMoviesUrl.js]: src/js/values/myMoviesUrl.js
[myMoviesUrlFallback.js]: src/js/values/myMoviesUrlFallback01.js
[markdown editor]: <http://dillinger.io> "dillinger.io is an online markdown editor that can save to and import from your Dropbox or OneDrive"
[pluralsight tutorial]: <https://app.pluralsight.com/library/courses/angularjs-ngmock-unit-testing>
[omdb api]: <http://omdbapi.com>
[spring boot getting started document]: <http://docs.spring.io/spring-boot/docs/current-SNAPSHOT/reference/htmlsingle/#getting-started-installing-spring-boot>
[another GitHub project]: <https://github.com/AlgiersJUG/spring-boot-postgres-sample>
[same-file link]: http://stackoverflow.com/questions/6695439/how-do-you-create-link-to-a-named-anchor-in-multimarkdown
[markdown primer]: https://gitlab.com/gitlab-org/gitlab-ce/blob/master/doc/user/markdown.md

[Project description]: ReadMe.md#describe
[Installation procedure]: ReadMe.md#setup
[Open the project in Eclipse]: ReadMe.md#open
[Run the back end server from Eclipse]: ReadMe.md#run
[Run the back end server from IntelliJ]: ReadMe.md#run2
[Once you are satisfied with the back-end model]: ReadMe.md#mod
[Unit Tests]: ReadMe.md#test
[Troubleshooting]: ReadMe.md#fix
[Links and Credits]: ReadMe.md#stroke

<br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br /><br />
