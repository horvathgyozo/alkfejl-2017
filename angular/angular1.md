# Web engineering practice -- Angular: installation, generating HTML, using CSS framework, components, routing

For the client-side web development we will use the [Angular][1] framework, with the help of the [Angular command line interface][2] (Angular CLI).

## 1. Preparation

We need at least [Node.js][3] 6.9.0 and NPM 3.0. The following commands help checking the installed versions:

```sh
> node -v
v7.4.0
> npm -v
4.0.5
```

## 2. Installation

```sh
# install the angular cli globally (-g)
npm install -g @angular/cli
# create a new application
ng new recipe-app
## go into the app directory
cd recipe-app
```

This will create the folder structure of the new application, installs the compile-time and runtime dependencies, and create a local git repository for the version control of the code.

### 2.1. In the computer labs

The folder of the global npm packages is not in the PATH variable, so we have to use the `ng` command with an absolute path. Fortunately, it is only necessary once, because -- after a project is created -- the Angular CLI can be accessed locally in the project. So the former sequence of commands should be the following in the computer labs in Windows:

```sh
# install the angular cli globally (-g)
npm install -g @angular/cli
# create a new application
c:\Users\<username>\AppData\Roaming\npm\ng new recipe-app
## go into the app directory
cd recipe-app
```

## 3. Usage

After installation the Angular CLI can be used with the `ng` command. Since it is installed locally to the project, it is configured to be used through npm scripts, so we can call it with `npm run ng` as well. In the following we will use this longer but more accessible version.

The available `ng` commands are listed after calling `npm run ng help`.

The installed application is a working starter application, and we can start it with `npm run ng serve` or `npm start` (which is an alias for `ng serve`). A development server starts, and we can access our new application on [http://localhost:4200][6] in the browser. From now the development environment watches the file changes, and the appropriate codes will be compiled and refreshed in the browser.    

We can use the Angular CLI to generate different types of code for us with the `npm run ng generate <type> <name>` command.

### 3.1. Folder structure

The default folder structure ensures a `src/app` folder, which contains the source code of the application. It is up to us how to structure the source code here, but it is advisable to put the different part of the application into separate folders(e.g. `components`, `modules`, `services`). The Angular CLI will create folders when we use it to generate different types of code.

[https://angular.io/guide/quickstart#project-file-review][4]


## 4. Angular philosophy

Angular has a [very good documentation](https://angular.io/guide/quickstart) and a very detailed [tutorial](https://angular.io/tutorial).

In Angular we build up our application from components, which are independent and isolated from each other, and thus they can be reusable for example in other projects.

## 5. Components

```sh
npm run ng generate component <name>
```

A component is usually built up from three files, following the naming convention below, where `<name>` is the name of the component:

* `<name>.component.ts`
* `<name>.component.html`
* `<name>.component.css`

The business login sits in the TypeScript file, the template of the component is in the `.html` file, and the well-isolated styles of the component is located in the css file. This isolation makes the component reusable.

### 5.1. Static components

A component is static if its class definition is stateless, its template does not interpolate time-varying data.

#### 5.1.1. Example

my-component.component.ts
```ts
@Component({
    selector: 'my-component',
    templateUrl: 'my-component.component.html',
    styleSheets: [
        'my-component.component.css'
    ]
})
class MyComponent { }
```

my-component.component.html
```html
<h1>It works!</h1>
```

### 5.2. Dynamic components

In contrast, the state, and thus the appearance of a dynamic component, may change over time.

#### 5.2.1. Example

my-component.component.ts
```ts
@Component({
    selector: 'my-component',
    templateUrl: 'my-component.component.html',
    styleSheets: [
        'my-component.component.css'
    ]
})
class MyComponent {
    private _greetings: string[];
    private greeting: string;
    private _index: number;

    constructor() {
        this._greetings = [
            'Jó reggelt!',
            'Good morning!',
            'Guten tag!',
            'Buenos dias!'
        ];
        this._index = 0

        this._tick()
    }

    private _tick(): void {
        this.greeting = this._greetings[this._index];

        if (this._index + 1 < this._greetings.length) {
            ++this._index;
        }
        else {
            this._index = 0
        }

        setTimeout(this._tick.bind(this), 1000)
    }
}
```

my-component.component.html
```html
<h1><{{ greeting }}/h1>
```

## 6. Development method (in this course)

We will proceed layer by layer from the frontend to the backend. The planned steps are the following:

1. Generating HTML output with components, styling the components, using material ui and bootstrap, basic navigation with routing
2. Introducing and displaying data from the components, handling events, component composition
3. Form processing
4. Service layers
5. Handling asynchrony, REST layers
6. Authentication and authorization
7. (Testing)


## 7. Steps for building the UI

In this example we will make a main page, a list page for the recipes, a page for showing the details of one recipe, and a page for adding a new recipe. Basically we need to do 3 things:

- Design the pages with HTML and CSS
- Make components for each page
- Introduce routing for navigation

First we can work in the `app.component.html`. We can design the main page and another page (e.g. the listing one) and put one under the other. For the design we have many options:

- [Twitter Bootstrap][9] for the grid system and common components
- [ng-bootstrap][15] for Bootstrap-compatible smart components (to avoid using jQuery)
- [Material UI][7] for common components
- [`flex-layout`][8] for grid system
- [Bulma][10] for the grid system and common components

The most Angular-ish way would use Material UI and flex-layout. But now we will use Bootstrap for CSS and ng-bootstrap for components.

### 7.1. Styling

A component can be styled in the `*.component.css` file. Those CSS rules are separated from the other components. If you would like to use global styles, then we can introduce them in `app/style.css`.

#### 7.1.1. Bootstrap

**Option 1.** Use the CDN source. In `style.css` put the following import statement:

```css
@import "https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css";
```

**Option 2.** Install Bootstrap, and include it via `.angular-cli.json` file:

```sh
npm install --save bootstrap
```

`.angular-cli.json`
```json
"styles": [
  "../node_modules/bootstrap/dist/css/bootstrap.min.css",
  "styles.css"
],
```

**Option 3.** Use the [ngx-bootstrap][11] library.

**Option 4.** Include `bootstrap.js` and `jquery.js` either in `.angular-cli.json` or `index.html`. But this can be risky.

#### 7.1.2. ng-bootstrap

Follow the [guide](https://ng-bootstrap.github.io/#/getting-started).

```sh
npm install --save @ng-bootstrap/ng-bootstrap
```

In `app.module.ts` add the following imports:

```ts
import {NgbModule} from '@ng-bootstrap/ng-bootstrap'; // <-- this

@NgModule({
  declarations: [AppComponent, ...],
  imports: [NgbModule.forRoot(), ...],                // <-- this
  bootstrap: [AppComponent]
})
export class AppModule {
}
```

#### 7.1.3. Navigation bar

You can use the following code for creating a responsive navigation bar in `app.component.html`:

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="#">Recipes</a>
  <button class="navbar-toggler" type="button">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse">
    <ul class="navbar-nav mr-auto">
      <li class="nav-item">
        <a class="nav-link" href="#">Recipes</a>
      </li>
      <li class="nav-item">
        <a class="nav-link" href="#">New recipe</a>
      </li>
    </ul>
  </div>
</nav>
```

#### 7.1.4. Make the navigation bar collapsible (optional)

Add the following property to `app.component.ts`:

```ts
export class AppComponent {
  isCollapsed = true;
}
```

Modify `app.component.html` with these changes:

```html
<nav class="navbar navbar-expand-lg navbar-dark bg-dark">
  <a class="navbar-brand" href="#">Recipes</a>
  <button class="navbar-toggler" type="button" (click)="isCollapsed = !isCollapsed">
    <span class="navbar-toggler-icon"></span>
  </button>

  <div class="collapse navbar-collapse" [ngbCollapse]="isCollapsed">
    <!-- ... -->
  </div>
</nav>
```


### 7.2. Add content to the main page

From this file () use the mockups and put them into `app.component.html` under each other. Now you have three functionalities in one page.

### 7.3. Creating components

First we box those functionalities into components. Start with the recipe-list!

```sh
npm run ng generate component recipe-list
```

In `recipe-list.component.ts` change the selector to `recipe-list`. Put the necessary HTML and CSS code (if any) into `recipe-list.component.html` and `recipe-list.component.css`, and in the `app.component.html` file just refer to that component in this way:

```html
<recipe-list></recipe-list>
```

Do the same steps with the other component as well (`recipe-form`, `recipe-detail`).


### 7.4. Routing

Create a new module `Routing`:

```sh
npm run ng generate module routing
```

Add the following to `routing.module.ts`:

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { RecipeListComponent } from "../recipe-list/recipe-list.component";
import { RecipeFormComponent } from '../recipe-form/recipe-form.component';
import { RecipeDetailComponent } from '../recipe-detail/recipe-detail.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/recipes',
    pathMatch: 'full'
  },
  {
    path: 'recipes',
    component: RecipeListComponent
  },
  {
    path: 'recipes/new',
    component: RecipeFormComponent
  },
  {
    path: 'recipes/:id',
    component: RecipeDetailComponent
  },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)  ],
  exports: [ RouterModule ],
  declarations: []
})
export class RoutingModule { }
```

We have to import the routing module into the app module (`app.module.ts`):

```ts
import { RoutingModule } from './routing/routing.module';

@NgModule({
  // ...
  imports: [
    // ...
    RoutingModule,
  ],
  // ...
})
export class AppModule { }
```

We have to define a `router-outlet` component in `app.component.html`, and the router will put the navigated page *after* this placeholder component.

```html
<router-outlet></router-outlet>
```

Now we have to use `routerLink` instead of `href`, when we want in-app navigation, e.g. in the navigation bar:

```html
<a class="nav-link" routerLink="/recipes/new">New recipe</a>
```


## Monday

- 

## Tuesday

- 


[1]: https://angular.io/
[2]: https://cli.angular.io/
[3]: https://nodejs.org/
[4]: https://angular.io/guide/quickstart#project-file-review
[5]: https://angular.io/guide/displaying-data#showing-an-array-property-with-ngfor
[6]: http://localhost:4200

[7]: https://material.angular.io/
[8]: https://github.com/angular/flex-layout
[9]: http://getbootstrap.com/docs/4.0/getting-started/introduction/
[10]: https://bulma.io/
[11]: https://loiane.com/2017/08/how-to-add-bootstrap-to-an-angular-cli-project/#4-bootstrap-javascript-components-with-ngx-bootstrap-option-1
[12]: https://material.angular.io/guide/getting-started
[13]: https://material.io/icons/
[14]: https://github.com/angular/flex-layout/wiki/Using-Angular-CLI
[15]: https://ng-bootstrap.github.io