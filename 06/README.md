# 6. gyakorlat: Angular kezdetek

For the client-side part of our application we will use the [Angular][1] framework, with the help of the [Angular command line interface][2] (Angular CLI).

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
ng new issue-tracker-app
## go into the app directory
cd issue-tracker-app
```

This will create the folder structure of the new application, installs the compile-time and runtime dependencies, and create a local git repository for the version control of the code.

### 2.1. In the computer labs

The folder of the global npm packages is not in the PATH variable, so we have to use the `ng` command with an absolute path. Fortunately, it is only necessary once, because -- after a project is created -- the Angular CLI can be accessed locally in the project. So the former sequence of commands should be the following in the computer labs in Windows:

```sh
# install the angular cli globally (-g)
npm install -g @angular/cli
# create a new application
c:\Users\<username>\AppData\Roaming\npm\ng new issue-tracker-app
## go into the app directory
cd issue-tracker-app
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

Egy-egy komponens általában három fájlból épül fel, melyek a következő elnevezési konvenciót követik, ahol a `<name>` a komponens kívánt neve:

* `<name>.component.ts`
* `<name>.component.html`
* `<name>.component.css`

A komponens üzleti logikáját leíró TypeScript fájl és a sablon mellé kerülő CSS fájl a már korábban említett újrahasznósíthatóságot kívánja betartatni egy generikus stíluslappal ellentétben.

Megyjegyzés: A komponens specifikus CSS fájlok végül `<style></style>` címkék közé interpolálódva jelennek meg a komponens fa felépítésének sorrendjében.

Az MVC modellel szemben itt inkább egy M(V)C modellről beszélhetünk, hiszen a komponenseink lefedik a nézeti és kontrolleri rétegeket, azonban a gyakori funkcionalításokat továbbra is szolgáltatásokba szervezzük.

### 5.1. Statikus komponensek

Egy komponenst statikusnak nevezünk, ha osztálydefiníciója állapotmentes, sablonja nem interpolál időben változó adatokat.

#### 5.1.1. Példa

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

### 5.2. Dinamikus komponensek

A dinamikus komponensek állapotában és egyúttal megjelenésében ezzel szemben idővel változás állhat be.

#### 5.2.1. Példa

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
5. Handling asynchronity, REST layers
6. Authentication and authorization
7. Testing


## 7. Steps for building the UI

In this example we will make a main page, a list page for the issues, a page for showing the details and messages of one issue, and a page for adding a new issue. Basically we need to do 3 things:

- Design the pages with HTML and CSS
- Make components for each page
- Introduce routing for navigation

First we can work in the `app.component.html`. We can design the main page and another page (e.g. the listing one) and put one below the other. For the design we have many options:

- [Material UI][7] for common components
- [Twitter Bootstrap][9] for the grid system and common components
- [`flex-layout`][8] for grid system
- [Bulma][10] for the grid system and common components

The most Angular-ish way would use Material UI and flex-layout. But the latter is not so user-friendly, so we can mix up Angular with Bootstrap. We will use mainly the grid system from Bootstrap, and we avoid using the its JavaScript (and jQuery) part. From this point of view Bulma would be a better option, because it is by definition a JavaScript-less CSS framework, but it is quite new.

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


#### 7.1.2. Material UI

Just follow the [getting started guide][12] of the project.

```sh
npm install --save @angular/material @angular/cdk
npm install --save @angular/animations
```

Import the necessary modules into `app.module.ts`.

Add the theme and [icons][13] to `style.css`:

```css
@import "~@angular/material/prebuilt-themes/indigo-pink.css";
@import "https://fonts.googleapis.com/icon?family=Material+Icons";
```

#### 7.1.3. Flex-layout

Follow the [guide][14] and import the `FlexLayoutModule` into the app module.

```sh
npm install @angular/flex-layout --save
```

#### 7.1.4. Navigation bar

You can use the following code for creating a responsive navigation bar (Material UI + Flex-layout) in `app.component.html`:

```html
<mat-toolbar color="primary">
  <button mat-button href="/">
    <mat-icon>home</mat-icon>
    Issue tracker
  </button>

  <span class="fill-remaining-space" fxHide="false" fxHide.gt-sm></span>
  <div fxLayout="row" fxShow="false" fxShow.gt-sm>
    <button mat-button href="/issues">My issues</button>
    <button mat-button href="/issues/add">New issues</button>
  </div>
  <button mat-icon-button [matMenuTriggerFor]="menu" fxHide="false" fxHide.gt-sm>
    <mat-icon>menu</mat-icon>
  </button>
</mat-toolbar>
<mat-menu xPosition="before" #menu="matMenu">
  <button mat-menu-item href="/issues">My issues</button>
  <button mat-menu-item href="/issues/add">New issues</button>
</mat-menu>
```


### 7.2. Creating components

```sh
npm run ng generate component main-page
```

Put the necessary HTML and CSS code into `main-page.component.html` and `main-page.component.css`, and in the `app.component.html` file just refer to that component in this way:

```html
<main-page></main-page>
```

Do the same steps with the other component as well.


### 7.3. Routing

Create a new module `Routing`:

```sh
npm run ng generate module routing
```

Add the following to `routing.module.ts`:

```ts
import { NgModule } from '@angular/core';
import { RouterModule, Routes }   from '@angular/router';

import { AppComponent } from '../app.component';
import { MainPageComponent } from '../dashboard/dashboard.component';

const routes: Routes = [
  {
    path: '',
    redirectTo: '/dashboard',
    pathMatch: 'full'
  },
  {
    path: 'dashboard',
    component: MainPageComponent
  },
  {
    path: 'issues',
    component: IssueListComponent
  },
//   {
//     path: 'issues/add',
//     component: IssueFormComponent
//   },
//   {
//     path: 'issues/:id',
//     component: IssueDetailComponent
//   },
];

@NgModule({
  imports: [ RouterModule.forRoot(routes)  ],
  exports: [ RouterModule ],
  declarations: []
})
export class RoutingModule { }
```

We have to import the routing module into the app module:

```ts
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
<button mat-button routerLink="/issues">My issues</button>
```

## 8. Tasks

Create a working UI prototype for the issue-tracker, with components and routing!




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