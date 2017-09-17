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

## Displaying data

- https://spring.io/guides/gs/accessing-data-jpa/

