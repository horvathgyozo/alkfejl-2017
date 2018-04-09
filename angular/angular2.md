# Web engineering practice -- Angular: dynamic templates, component interaction, services, HTTP communication


## Tasks

1. Define an array of recipes in the component, and generate the recipe list HTML from this! (dynamic output with templates)
2. Make the navigation bar collapsible! (dynamic output and event handling)
3. Search box (component interaction)
4. Services (separating business logic and data from components, or shared business logic across components)
5. Form
    - model
    - two-way data binding
    - input element validation
    - form validation
    - add, update recipe in the service
    - save new recipe
    - edit a recipe
    - (delete a recipe)
6. HTTP service
    - preparations
    - get all recipes
    - get one recipe
    - edit a recipe
    - add a recipe
    - (delete a recipe)


## 1. Dynamic components

### 1.1. Displaying component data in the template (generating HTML)

If we have a data property in a component class, then it can be accessed from the template by referring to the data property with its name.

`some.component.ts`
```ts
export class SomeComponent {
  name = 'Győző';
}
```

`some.component.html`
```html
<p>Hello {{ name }}!</p>
```

Sometimes we need to set values of an HTML attribute (more precisely a DOM property), this is called *property binding*:

`some.component.html`
```html
<input type="text" [value]="name">
<input type="text" value="{{ name }}">
```

### 1.2. Handling events from the UI

User interactions generate events, and dynamic web pages react to those events. We can register a component method to an event with the *event binding*:

`some.component.html`
```html
<input type="text" [value]="name">
<input type="button" (click)="changeName()">
```

`some.component.ts`
```ts
export class SomeComponent {
  name = 'Győző';
  changeName() {
    this.name = 'Victorious';
  }
}
```

### 1.3. Conditionals and iteration in templates

You can use `*ngIf` and `*ngFor` for that purpose.

```html
<p *ngIf="logical expression">Hello {{ name }}!</p>

<ul>
  <li *ngFor="let recipe of recipes">{{ recipe.name }}</li>
</ul>
```

## 2. Component interaction

### 2.1. Parent-child interaction

If a component takes place in another component, the parent component can give data to the child component with *data binding* (`[]`), and the child can send data to the parent component with *event binding* (`()`).

```txt
+-------------------------------------+
|          Parent component           |
|                                     |
|   [data    +        ^  (event       |
|   binding] |        |  binding)     |
|            |        |               |
|     +------v--------+--------+      |
|     |    Child component     |      |
|     |                        |      |
|     +------------------------+      |
|                                     |
+-------------------------------------+
```

#### 2.1.1. Data binding

The child component has to define an input data property in the component class with the `@Input()` decorator.

```js
import { Input } from '@angular/core';

export class ExampleChildComponent {
  @Input('value') text: string = "";
}
```

The parent component can send data into the child component with data binding:

```html
<example-child [value]="data"></example-child>
```

Every time data changes in the parent component, it is sent to the child component, and the child component re-renders.

#### 2.1.2. Event binding

A child component can send data to the parent component by emitting events:

```js
import { Output, EventEmitter } from '@angular/core';

export class ExampleChildComponent {

  @Output() dataChange: EventEmitter<string> = new EventEmitter<string>();

  someMethod(value) {
    this.dataChange.emit(value);
  }
}
```

The parent component can register an event handler for that event with event binding. We can refer to the sent data with `$event`.

```html
<example-child (dataChange)="onDataChange($event)"></example-child>
```

The event handler method should be defined in the parent component class:

```js
export class ExampleParentComponent {
  onDataChange(value) {
    console.log(value);
  }
}
```

### 2.2. Through services

Services (see below) can be used for passing data to another component even when they are in no direct parent-child connection (e.g. siblings, different routes). The Angular documentation has a good section about using [observables to communicate through services](https://angular.io/guide/component-interaction#parent-and-children-communicate-via-a-service).

## 3. Services

Services can be used to separate business logic, data storing or data procession from managing the view layer. They are also good when we want to share data and business logic across multiple components.

We can generate a service with Angular CLI:

```sh
npm run ng generate service recipe
```

It will create a `recipe.service.ts` file with a `RecipeService` class exported. We can implement arbitrary logic inside this class, exposing data properties and methods.

We have two options to use this service. If it is only needed for one component, then we have to add it to the `providers` array of the `@Component`, and inject it into the class in the constructor.

```js
@Component({
  providers: [RecipeService]
})
export class RecipeListComponent { 
  constructor(
    private recipeService: RecipeService
  ) { }
}
```

The other, more common option is to use a service module-wide as a singleton. In this case it should be provided by the module (e.g. `app.module.ts`).

```js
import { RecipeService } from './recipe.service';

@NgModule({
  /* ... */
  providers: [RecipeService],
})
export class AppModule { }
```

Then it can be injected into a component in the same way than in the first option.

## 4. Forms

In Angular we have two options to manage a form: [template-driven forms](https://angular.io/guide/forms) or [reactive forms](https://angular.io/guide/reactive-forms). The former easier at first but has some limitations later, the latter is more complex but has advantages in the long run. We will use template-driven forms.

### 4.1. Form model

Usually it is a good practice to define a data model for storing the values of the input elements.

```js
export class RecipeFormComponent {
  model: Recipe = new Recipe();
}
```

### 4.2. Two-way data binding

Then we can bind with [*two-way data binding*](https://angular.io/guide/template-syntax#two-way-binding---) the input elements to the model properties. It is achieved with the help of [`ngModel` attribute directive](https://angular.io/guide/template-syntax#ngmodel---two-way-binding-to-form-elements-with-ngmodel), for which the `FormsModule` needs to be imported in `app.module.ts`.

```js
import { FormsModule } from '@angular/forms';

@NgModule({
  /* ... */
  imports: [
    FormsModule,
  ],
})
export class AppModule { }
```

Then in the template of the form component class we can use the `ngModel` directive. For this the `name` property of the input element must be set.

```html
<input [(ngModel)]="model.title" type="text" name="title">
```

### 4.3. Input element validation

We will use HTML5 input validation attributes, e.g. `required`, `minlength` or `pattern`:

```html
<input [(ngModel)]="model.title" type="text" name="title"
  required
  minlength="3" 
>
```

You can access the state of the input element through the ngModel object. Make a *template reference* with ngModel as a value:

```html
<input [(ngModel)]="model.title" type="text" name="title"
  required
  minlength="3"
  #title="ngModel"
>
```

Now `title` has properties like:

- `valid`
- `invalid`
- `touched`
- `dirty`
- `pristine`
- `errors`

We can make conditional CSS class settings based on these values:

```html
<input [(ngModel)]="model.title" type="text" name="title" 
  required
  minlength="3"
  #title="ngModel"
  [class.is-invalid]="title.invalid && (title.dirty || title.touched)"
  [class.is-valid]="title.valid"
>
```

Showing errors can be done conditionally as well:

```html
<input [(ngModel)]="model.title" type="text" name="title" 
  required
  minlength="3"
  #title="ngModel"
  [class.is-invalid]="title.invalid && (title.dirty || title.touched)"
  [class.is-valid]="title.valid"
>
<div class="invalid-feedback" *ngIf="title.invalid && title.errors.required">
  Please provide a recipe name!
</div>
<div class="invalid-feedback" *ngIf="title.invalid && title.errors.minlength">
  A recipe name is at least 3 characters long!
</div>
```

### 4.4. Form validation

We can use `ngForm` to get informations of the form state, like

- `valid`
- `invalid`
- `value`
- `controls`

Make a template reference to the ngForm, and give its value as a parameter of the submit event handler:

```html
<form (submit)="submit(recipeForm)" #recipeForm="ngForm">
</form>
```

The in the component class the event handler can make a logic in its properties:

```js
submit(form) {
  if (!form.valid) {
    return;
  }
  // save the form model  
}
```

We can even make the submit button disabled when the form is not valid:

```html
<button type="submit" class="btn btn-primary" [disabled]="!recipeForm.valid">Submit</button>
```

### 4.5. Other references

- [Template driven forms (scotch.io)](https://scotch.io/tutorials/using-angular-2s-template-driven-forms)
- [Template driven forms](https://toddmotto.com/angular-2-forms-template-driven)
- [Validate on submit](https://loiane.com/2017/08/angular-reactive-forms-trigger-validation-on-submit/#validating-all-fields-on-submit)
- [Validate on submit](https://stackoverflow.com/questions/39893430/angular-2-reactive-forms-trigger-validation-on-submit)


## 5. HTTP communication with a REST API

For HTTP communication we will use `HttpClient` from the `HttpClientModule`. First we need to import `HttpClientModule` into our application module (`app.module.ts`):

```js
import { HttpClientModule } from "@angular/common/http";

@NgModule({
  /* ... */
  imports: [
    HttpClientModule,
  ],
})
export class AppModule { }
```

Then we can use `HttpClient` in our service:

```js
import { HttpClient, HttpHeaders } from '@angular/common/http';

const httpOptions = {
  headers: new HttpHeaders({ 'Content-Type': 'application/json' })
};

@Injectable()
export class RecipeService {

  private recipeUrl = 'http://localhost:3030/recipes';

  constructor(
    private http: HttpClient
  ) { }
}
```

The `http` object has high-level method for sending HTTP request, and can cast the response object into a specific type:

- `get<T>(url)`
- `post<T>(url, body, headers)`
- `put<T>(url, body, headers)`
- `delete<T>(url, headers)`

The return value will be an observable, which can be transformed into a promise:

```ts
getRecipe(id: number): Promise<Recipe> {
  return this.http.get<Recipe>(`${this.recipeUrl}/${id}`).toPromise();
}
```

If the response is wrapped into an object, then we have to define an interface for the response, and use the `map` method to get the inner data. For example, using Feathers for the REST API, the response of a collection will be put into an object like this:

```js
{
  total: 0,
  limit: 0,
  skip: 0,
  data: []
}
```

The `data` property is what we would like to return, so we have to dig for that:

```js
import 'rxjs/add/operator/map';

interface FeathersResponse<T> {
  total: number,
  limit: number,
  skip: number,
  data: T[]
};

@Injectable()
export class RecipeService {
  getRecipes(): Promise<Recipe[]> {
    return this.http.get<FeathersResponse<Recipe>>(this.recipeUrl)
      .map(response => response.data)
      .toPromise();
  }
}
```

In the caller environment we can use async-await functions to handle the responses:

```js
export class RecipeListComponent implements OnInit {

  recipes: Recipe[];

  constructor(
    private recipeService: RecipeService
  ) { }

  async ngOnInit() {
    this.recipes = await this.recipeService.getRecipes();
  }
}
```


## 6. The recipe application

The example application is [in this Github repository](https://github.com/horvathgyozo/angular-recipes).
You can follow the evolution of the code by browsing the commits on Github, or cloning the repository to your local machine, and using `gitk` for example.

```sh
git clone https://github.com/horvathgyozo/angular-recipes.git
cd angular-recipes
gitk
```

