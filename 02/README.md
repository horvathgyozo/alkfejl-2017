# 2. gyakorlat: Szerveroldali Java


## Some theory

- [Web technologies](https://developer.mozilla.org/en-US/docs/Web)
- [Web application architectures](http://webprogramozas.inf.elte.hu/alkfejl/04/#/4)
- HTTP protocol: [overview](https://developer.mozilla.org/en-US/docs/Web/HTTP/Overview) and [messages](https://developer.mozilla.org/en-US/docs/Web/HTTP/Messages)


## Initial application

[Spring guide](https://spring.io/guides/gs/spring-boot/#scratch)

You can choose any kind of Java editor (Netbeans, IntelliJ, Eclipse). If you want you can use the command line as well.

- Netbeans, new project, Maven, POM Project
- It will generate a folder with a `pom.xml` file in it. This file describes the project meta-informations, like name, description, java version, and dependencies.

For a very basic web application the following files are needed:

`pom.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<project xmlns="http://maven.apache.org/POM/4.0.0" xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
    xsi:schemaLocation="http://maven.apache.org/POM/4.0.0 http://maven.apache.org/xsd/maven-4.0.0.xsd">
    <modelVersion>4.0.0</modelVersion>

    <groupId>org.springframework</groupId>
    <artifactId>name-of-the-app</artifactId>
    <version>0.1.0</version>

    <properties>
        <java.version>1.8</java.version>
    </properties>

    <parent>
        <groupId>org.springframework.boot</groupId>
        <artifactId>spring-boot-starter-parent</artifactId>
        <version>1.5.6.RELEASE</version>
    </parent>

    <dependencies>
        <dependency>
            <groupId>org.springframework.boot</groupId>
            <artifactId>spring-boot-starter-web</artifactId>
        </dependency>
    </dependencies>

    <build>
        <plugins>
            <plugin>
                <groupId>org.springframework.boot</groupId>
                <artifactId>spring-boot-maven-plugin</artifactId>
            </plugin>
        </plugins>
    </build>

</project>
```

Creating the directory structure:

```txt
src/main/java/hello
```

Creating the main application (`src/main/java/hello/Application.java`):

```java
package hello;

import java.util.Arrays;

import org.springframework.boot.CommandLineRunner;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.context.ApplicationContext;
import org.springframework.context.annotation.Bean;

@SpringBootApplication
public class Application {

    public static void main(String[] args) {
        SpringApplication.run(Application.class, args);
    }

}
```

And finally one controller (`src/main/java/hello/HelloController.java`):

```java
package hello;

import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.bind.annotation.RequestMapping;

@RestController
public class HelloController {

    @RequestMapping("/")
    public String index() {
        return "Hello world!";
    }

}
```

where:

- `@RestController` = `@Controller` + `@ResponseBody`
- `@ResponseBody` treats the output as a data, not a view (easiest way to output text)
- `@ResquestMapping`: routing

Running the application:

- Click on the Run project button;
- or: Right click on `pom.xml`, Run maven/Goals/`spring-boot:run`
- or: in command line: `mvn spring-boot:run`

## Adding devtools

[Guide](https://docs.spring.io/spring-boot/docs/current/reference/htmlsingle/#using-boot-devtools)

Add the following dependency to `pom.xml`:

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-devtools</artifactId>
    <optional>true</optional>
</dependency>
```

Now if you change a file, Maven will restart the application.

## Using templates (generating output)

We need to add a template engine (`pom.xml`). We chose [Thymeleaf](http://www.thymeleaf.org/):

```xml
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

Then the thymeleaf templates should go into the `src/main/resources/templates` folder with `.html` suffix. Here is an example (`greeting.html`):

```html
<!DOCTYPE HTML>
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <title>With template engine</title>
    <meta charset="UTF-8" />
</head>
<body>
    <p th:text="'Hello, ' + ${name} + '!'">Hello világ</p>
</body>
</html>
```

A controller for this template:

```java
package hello;

import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;

@Controller
public class GreetingController {

    @RequestMapping("/greeting")
    public String greeting(@RequestParam(value="name", required=false, defaultValue="World") String name, Model model) {
        model.addAttribute("name", name);
        return "greeting";
    }

}
```

Try it with: `localhost:8080/greeting?name=alma`

## External style sheets

External style sheets should be put into `resources/static` directory. Create a style sheet file `styles.css` in it with the following content:

```css
p {
    color: red;
}
```

Then in the `hello.html` template file just include this style sheet with the `<link>` tag:

```html
<head>
    <!-- ... -->
    <link rel="stylesheet" href="styles.css" />
</head>
```

Every static resource (style sheets, images, html files) should be put into `static` directory, and they will be served from here. `static` directory is served from `/`. 

## Displaying data on templates

To render a specific template without any data, just return the template name:

```java
package hello.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;

@Controller
@RequestMapping("/student")
public class StudentController {
    
    @GetMapping("")
    public String studentList() {
        return "list";
    }
    
}
```

You can give data to the template with the injected `Model` object, using its `addAttribute` method:

```java
@GetMapping("")
public String studentList(Model model) {
    model.addAttribute("title", "Student list");
    model.addAttribute("students", Arrays.asList(
        "name1",
        "name2",
        "name3"
    ));
    return "list";
}
```

```html
<h1 th:text="${title}"></h1>
<ul>
    <li th:each="name : ${students}" th:text="${name}">names</li>
</ul>
```

## Using database

Fetching data from a database and displaying it on an HTML page consists of several steps. "Normally" first a database needs to be created (e.g. in PostgreSQL) with tables and data in it, and then a Java program connects to this database, fetches the records and gives them to the HTML template. Instead of low level library API calls, Java comes with a very robust persistence layer with many abstractions in it. It is called Java Persistence API (JPA).

```txt
Database <--> Entities <--> Repositories <--> (Services) <--> Controllers <--> Templates
```

In this tutorial we will use the h2 in-memory database. Altogether we need the following dependencies:

```xml
<dependency>
    <groupId>com.h2database</groupId>
    <artifactId>h2</artifactId>
    <scope>runtime</scope>
</dependency>
<dependency>
    <groupId>org.projectlombok</groupId>
    <artifactId>lombok</artifactId>
    <optional>true</optional>
</dependency>
<dependency>
    <groupId>org.springframework.boot</groupId>
    <artifactId>spring-boot-starter-data-jpa</artifactId>
</dependency>
```

### Configuration

By default Spring Boot will use h2 if it is among the dependencies with a default database named `testdb`. However we can set some properties in `application.properties` file to change some defaults:

```txt
# we set explicitly the database engine
spring.datasource.platform=h2

# make the h2 web console enabled
spring.h2.console.enabled=true

# the path for the h2 web console
spring.h2.console.path=/h2

# we can change the name of the database, in this case it will be called `mydb`
spring.datasource.url=jdbc:h2:mem:mydb

#show sql statement
logging.level.org.hibernate.SQL=debug

#show sql values
logging.level.org.hibernate.type.descriptor.sql=trace
```

Due to the in-memory nature, all data will be erased every time we restart our application. However we can set the table structure and can prefill those tables with some data, with the help of `schema.sql` (for creating tables) and `import.sql` (for seeding) placed in `src/main/resources` folder. This is the default place where Hibernate looks for these files.

Further references:

- [Database initialization](https://docs.spring.io/spring-boot/docs/current/reference/html/howto-database-initialization.html)
- [Show Hibernate SQL query](https://www.mkyong.com/spring-boot/spring-boot-show-hibernate-sql-query/)


### Entities

The first step is to define the entities, which represent one table per entity thanks to the ORM (Object Relational Mapping) philosophy. An entity is a Java class with `@Entity` annotation. This class represents a table in the database. Every data (or property) field of the class will be a column in the table. You can fine tune the table and column names and behaviour with further annotation. You can find these details in [JPA Persistence package documentation](https://docs.oracle.com/javaee/7/api/javax/persistence/package-summary.html).

```java
package hello.model;

import javax.persistence.*;
import lombok.Data;
import lombok.AllArgsConstructor;
import lombok.NoArgsConstructor;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class Student {
    
    @Id
    @GeneratedValue(strategy = GenerationType.AUTO)
    private long id;
    
    @Column(name="first_name", nullable=false, length=100)
    private String firstname;
    
    @Column(name="last_name", nullable=true, length=100)
    private String lastname;
    
    @Column(nullable=false, length=7, unique = true)
    private String neptun;
}
```

The [`@Data` annotation](https://projectlombok.org/features/Data) comes from the Lombok library, and it helps reducing the boilerplate code by autogenerating the setter, getters and constructors.

If we run the application at this point, we can see in the h2 web console in the browser under `http://localhost:8080/h2`, that a Student table was created based on the informations of the entity class. If we gave an `import.sql`, then there should be some data in it:

```sql
insert into student (first_name, last_name, neptun) values ('John', 'Wick', 'abcdef1');
insert into student (first_name, last_name, neptun) values ('John', 'Doe', 'abcdef2');
insert into student (first_name, last_name, neptun) values ('Johnathan', 'Apple', 'abcdef3');
insert into student (first_name, last_name, neptun) values ('Bob', null, 'abcdef4');
insert into student (first_name, last_name, neptun) values ('Ian', 'Thorne', 'abcdef5');
```


### Repositories

The next step is to define a repository, which has all the necessary methods for handling the communication and data retrieval to the database. The logic of these methods usually are the same, and [JPA helps writing these repositories](https://docs.spring.io/spring-data/data-commons/docs/1.6.1.RELEASE/reference/html/repositories.html). For defining the `StudentRepository` we only need to define an interface extending from `CrudRepository`:

```java
package hello.repository;

import hello.model.Student;
import java.util.List;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.CrudRepository;

public interface StudentRepository extends CrudRepository<Student, Long> {

    Student findByNeptun(String neptun);

    @Query("select s.firstname from Student s where s.firstname like ?1%")
    List<Student> findByFirstNameSegment(String firstName);
}
```

The basic `CrudRepository` interface has the methods like `findAll`, `findOne`, `save`, but this can be extended with further methods which work by naming conventions, e.g. `findByNeptun`. `findByFirstNameSegment` method shows an example how to provide the query for a method.

### Services

Service classes stand between controllers and repositories. They take out data handling logic from controllers, making these logics reusable. They need to be annotated with `@Service`:

```java
package hello.service;

import hello.model.Student;
import hello.repository.StudentRepository;
import java.util.List;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

@Service
public class StudentService {

    @Autowired
    private StudentRepository studentRepository;
       
    public List<Student> studentNamesStartingWith(String segment) {
        return studentRepository.findByFirstNameSegment(segment);
    }
}
```

### Controllers

The controller should work with the service object:

```java
public class StudentController {
    
    @Autowired
    private StudentService studentService;
    
    @GetMapping("")
    public String studentList(Model model) {
        model.addAttribute("title", "Student list");
        model.addAttribute("students", studentService.studentNamesStartingWith("John"));
        return "list";
    }
}
```


### HTML template

```html
<h1 th:text="${title}"></h1>
<ul>
    <li th:each="s : ${students}" th:text="${s}">names</li>
</ul>
```


