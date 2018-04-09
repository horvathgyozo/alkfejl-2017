# Web engineering practice -- Angular: Authentication, model relations

## Tasks

1. Add login/logout functionality to your application
    - show the information in the navigation bar
    - login functionality
    - logout functionality
    - protect specific endpoints with route guards
2. Authenticate your endpoints
3. Introduce comments on recipes in your application.
    - in your REST API layer
    - show them under a recipe
    - add a new comment to a recipe

## 1. REST API layer

We will use Feathers.js for our REST API, because it ensures high-level tools for quick prototyping.

### 1.1. Preparation

```sh
mkdir rest-recipe
cd rest-recipe
feathers generate app
feathers generate service  # recipes with Sequelize and SQLite
npm start
```

Edit the properties in `models/recipes.model.js`:

```js
// ...
const recipes = sequelizeClient.define('recipes', {
  title: {
    type: DataTypes.STRING,
    allowNull: false
  },
  description: {
    type: DataTypes.STRING,
    allowNull: false
  },
  ingredients: {
    type: DataTypes.STRING,
    allowNull: false
  },
  imgUrl: {
    type: DataTypes.STRING,
    allowNull: true
  }
}, // ...
)
```

### 1.2. Tools

Use [Advanced REST Client](https://chrome.google.com/webstore/detail/advanced-rest-client/hgmloofddffdnphfgcellkdfbfbjeloo) or [Postman](https://www.getpostman.com/) for testing and using REST APIs.

For follow the data changes in the SQLite database, you can use a [DB browser for SQLite](http://sqlitebrowser.org/). It has a portable version, so you can install it on your desktop without any further permission (e.g. in a computer lab).

### 1.3. Model relations

Let us define a `messages` service for storing comments on recipes.

```sh
feathers generate service # messages with Sequelize and SQLite
```

Now, recipes and messages are in a `1:n` relation or one-to-many relation. You can explicitly set this kind of relation in `recipes.model.js` file:

```js
recipes.associate = function (models) {
  recipes.hasMany(models.messages);
};
```

We are using Sequelize, so you can read further information on relationships in the [Sequelize documentation](http://docs.sequelizejs.com/en/latest/docs/associations/).

After restarting the feathers application, the changes will be applied. You can force table changes in the `sequelize.js` file:

```js
sequelize.sync({force: true});
```

### 1.4. Populating relations

Once we will have authentication the message will be bind to a user who commented on the recipe. It would be nice if the message would contain not only the `userId` but the user object itself. Feathers can handle this with its [populate hook](https://docs.feathersjs.com/api/hooks-common.html#populate). In `messages.hooks.js` add the following import and *after all* hook:

```js
const { populate } = require('feathers-hooks-common');

after: {
  all: [
    populate({
      schema: {
        include: [{
          service: 'users',
          nameAs: 'user',
          parentField: 'userId',
          childField: 'id'
        }]
      }
    })
  ],
}
```

### 1.5. Adding authentication

#### 1.5.1. Generating the authentication files

```sh
feathers generate authentication # local strategy, with Sequelize and SQLite
```

#### 1.5.2. Add further user properties if necessary

Edit `users.model.js` for adding further properties to the user schema. E.g. a name would be nice to be stored.

#### 1.5.3. Set-up model relations

1. A user has many recipes
2. A user has many messages

#### 1.5.4. Creating a user

```json
// POST /users
{
  "email": "joe@example.com",
  "password": "secret",
  "name": "Joe Shoe"
}
```

#### 1.5.5. Login

```json
// POST /authenticate
{
  "strategy": "local",
  "email": "joe@example.com",
  "password": "secret"
}
```

An access token will be sent back. The token should be stored on the client, and sent with the further requests in the `Authorization` header. Otherwise, for protected endpoints we will get an `Unauthorized` response.

#### 1.5.6. Logout

Delete the local token from your storage. (There are solutions for invalidating the access token on the server side, but for now it is out of scope.)

#### 1.5.7. Protecting endpoints

In the service hooks files add JWT (token-based) authentication for the before hooks. E.g. a recipe can be read by anyone, but adding, updating and deleting is only allowed for authenticated users.

```js
const { authenticate } = require('feathers-authentication').hooks;

// ...
before: {
  all: [],
  find: [],
  get: [],
  create: [ authenticate('jwt') ],
  update: [ authenticate('jwt') ],
  patch: [ authenticate('jwt') ],
  remove: [ authenticate('jwt') ]
}
```

#### 1.5.8. Sophisticated authorization is still missing

Now any authenticated user can modify a recipe, even when the recipe is not his or her. This detailed authorization should be implemented in before hooks, too. See [this description](https://github.com/feathersjs-ecosystem/feathers-authentication-hooks#restricttoowner).

#### 1.5.9. Retrieving user information

```txt
GET /users?email=joe@example.com
```


## 2. Angular functionalities

### 2.1. Authentication-related functions

#### 2.1.1. Auth service

Authentication related data and methods will be encapsulated in an authentication service, e.g. `auth.service.js`. Generate it with:

```sh
npm run ng generate service auth
```

Data properties:

- `isLoggedIn`: boolean value for the state of the login
- `user`: the user object (a `User` class is needed)

Methods:

- `login(user)`
- `logout()`
- `getLoggedInUser(email)`

**Interfaces**:

```js
interface AccessToken {
  accessToken: string
};

interface FeathersResponse<T> {
  total: number,
  limit: number,
  skip: number,
  data: T[]
};
```

The **access token** will be stored in the browser's `localStorage` store.

```js
window.localStorage.setItem('token', token);
window.localStorage.getItem('token');
window.localStorage.removeItem('token');
```

The access token should be sent with HTTP request in the `Authorization` header:

```js
private httpOptions() {
  const headers = { 'Content-Type': 'application/json' };
  if (window.localStorage.getItem('token')) {
    headers['Authorization'] = window.localStorage.getItem('token');
  }
  return {
    headers: new HttpHeaders(headers)
  };
}
```

#### 2.1.2. Navigation bar

Switch menu items according to the login state in `app.component.html`:

```html
<ul class="navbar-nav" *ngIf="!authService.isLoggedIn">
  <li class="nav-item">
    <a class="nav-link" routerLink="/login">Login</a>
  </li>
  <li class="nav-item">
    <a class="nav-link" routerLink="/register">Register</a>
  </li>
</ul>
<ul class="navbar-nav" *ngIf="authService.isLoggedIn">
  <span class="navbar-text">
    Hello {{ authService?.user?.name }}!
  </span>
  <li class="nav-item">
    <a class="nav-link" (click)="logout()">Logout</a>
  </li>
</ul>
```

#### 2.1.3. Login form

We need email verification. In Angular4+ it can be done by an `email` attribute in the input field:

```html
<div class="form-group">
  <label for="email">Email</label>
  <input [(ngModel)]="user.email" type="email" class="form-control" name="email" id="email" placeholder="Email address"
    required
    email
    #email="ngModel"
    [class.is-invalid]="email.invalid && (email.dirty || email.touched)"
    [class.is-valid]="email.valid"
  >
  <div class="invalid-feedback" *ngIf="email.invalid">
    Please provide an email address!
  </div>
</div>
```

Show a message above the form about the status of the login process. After a successful submission navigate the browser the recipe list page:

```js
import { Router } from '@angular/router';
// ...
constructor(
  private authService: AuthService,
  private router: Router
) { }
// ...
async submit(form) {
  if (form.invalid) {
    return;
  }
  try {
    this.message = "Try to login!";
    await this.authService.login(this.user);
    this.router.navigate(['/recipes']);
  }
  catch (err) {
    this.message = "Login failed!";
    console.log(err);
  }
}
```

#### 2.1.4. Route guards

To protect endpoints, use route guards during routing.

```sh
npm run ng generate guard auth
```

In the `auth.guard.js` check if the user is logged in and let him/her navigate to the page by returning true, or if it is not the case, then navigate the browser to the login page.

```js
canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {

  if (this.authService.isLoggedIn) {
    return true;
  }

  this.router.navigate(['/login']);
  return false;
}
```

In `routing.module.ts` protect the endpoints with the `canActivate` attribute:

```js
{
  path: 'recipes/new',
  component: RecipeFormComponent,
  canActivate: [AuthGuard]
}
```

And finally register your route guard as a service in `app.module.ts` file among the providers.

```js
providers: [RecipeService, AuthService, AuthGuard],
```

## 3. The recipe application

The example application is [in this Github repository](https://github.com/horvathgyozo/angular-recipes).
You can follow the evolution of the code by browsing the commits on Github, or cloning the repository to your local machine, and using `gitk` for example.

```sh
git clone https://github.com/horvathgyozo/angular-recipes.git
cd angular-recipes
gitk
```

## Monday

- 

## Tuesday

- 


