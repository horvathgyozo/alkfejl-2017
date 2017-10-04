# 3. gyakorlat: Szerveroldali Java: űrlapok, hitelesítés, jogosultságvizsgálat

## Table of contents:

- Handling input
- *Form processing
- Login and register
    + user entity
    + repository
    + service
    + *register template
    + register controller
    + *login template
    + login controller
- Authentication and authorization


## Handling input

### GET parameters

Get parameters are in the *query part* of the URL (after `?` sign):

```txt
http://localhost:8080/hello/get?name=Győző
```

To get these informations we need to use `@RequestParam` annotation before a parameter in the controller method:

```java
@RequestMapping("/get")
public String getParameters(@RequestParam(required = false, defaultValue = "world", name = "name") String name) {
    return "Hello " + name; 
}
```

### Path parameters

For getting values form path segments, use the `@PathVariable` paramter annotation:

```java
// http://localhost:8080/hello/Győző
@RequestMapping("/{name}")
public String pathParameter(@PathVariable String name) {
    return "Hello " + name; 
}
```

### Request body

If we need the body of the HTTP request, then we can use the `@RequestBody` annotation, like in this example:

```java
@PostMapping
@ResponseStatus(HttpStatus.CREATED)
public void add(@RequestBody Person person) {
        // ...
}
```

It is mostly used in REST APIs.

## Form processing

The philosophy behind form processing is *bean-backed forms* in Spring MVC. During serving a request every controller has a so-called implicit model, which helps interchanging the data between the controller and the view. We can add attributes to this implicit model with method-based `@ModelAttribute` annotation (and this will be common for every controller method), or giving a `Model` parameter to the controller, as we saw earlier.

```java
// For every controller method
@ModelAttribute("student")
public Student addStudent() {
    return new Student();
}

// For only this method
@GetMapping("")
public String studentList(Model model) {
    model.addAttribute("student", new Student());
    return "list";
}

@GetMapping("")
public String studentList(Student student) {
    return "list";
}
```

In the template we need to define a *command object*. This command object will be populated with the data coming from the form, filling up the data attributes of the object with the paramaters with same names, and this object will be a part of the implicit web-view model, and can ask it with a parameter, where parameter-level `@ModelAttribute` annotation can be used to customize the parameter name.

In Thymeleaf the template object can be assigned to the form with the `th:object` attribute. Action need to be an URL, so we use Thymeleaf's `@` helper sign for that in `th:action`. Input fields can be generated with the `th:input` attribute.

```html
<form action="#" th:action="@{/student}" th:object="${student}" method="post">
    Firstname: <input type="text" th:field="*{firstname}" /> <br />
    Lastname: <input type="text" th:field="*{lastname}" /> <br />
    Neptun: <input type="text" th:field="*{neptun}" /> <br />
    <button type="submit">Submit</button>
</form>
```

In the receiver controller method we get the populated Student object, and save it to the repository, and redirect the browser to the list page:

```java
@PostMapping
public String addStudent(Student student) {
    studentService.save(student);
    return "redirect:/student"
}
```

### Form validation

[Spring Boot tutorial on form validation](https://spring.io/guides/gs/validating-form-input/)


## Register and login

We have all the necessary information to add a register and login functionality to the application. You can follow these steps on the [description of the example application](https://github.com/godzsa/issue-tracker). We need to do the following:

- add a `User` entity
- create a repository for using this entity:
    + `Optional<User> findByEmail(String email);`
    + `Optional<User> findByUsername(String username);`
    + `Optional<User> findByUsernameAndPassword(String username, String password);`
- create a service for using this repository:
    + `public void register(User user) { /*...*/ }`
    + `public boolean isValid(User user) { /*...*/ }`
    + `public User login(User user) throws UserNotValidException { /*...*/ }`
- create a `UserController`
    + `POST /login`
    + `POST /register`

## Authentication

- store the user in the session with the help of `@SessionScope` (e.g. on `UserService` or on a separate `SessionService`)
- add a new method to UserService
    + `public boolean isLoggedIn() { /*...*/ }`
- try it!

## Creating REST API

- add an `Issue` entity with repository and service
- set the relationship between the User and Issue (`[user] +-> 1..* [issue]`)
    + `@OneToMany` and `@ManyToOne`
- create a controller for issues (`@RestController`)

## Authorization

[See the example application](https://github.com/godzsa/issue-tracker/blob/master/README2.md)
