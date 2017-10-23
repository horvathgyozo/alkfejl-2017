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

### In the computer labs

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


## Angular philosophy

Angular has a [very good documentation](https://angular.io/guide/quickstart) and a very detailed [tutorial](https://angular.io/tutorial).

In Angular we build up our application from components, which are independent and isolated from each other, and thus they can be reusable for example in other projects.

## Components

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

### 4.1. Statikus komponensek

Egy komponenst statikusnak nevezünk, ha osztálydefiníciója állapotmentes, sablonja nem interpolál időben változó adatokat.

#### 4.1.1. Példa

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

### 4.2. Dinamikus komponensek

A dinamikus komponensek állapotában és egyúttal megjelenésében ezzel szemben idővel változás állhat be.

#### 4.2.1. Példa

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

## Development method (in this course)

We will proceed layer by layer from the frontend to the backend. The planned steps are the following:

1. Generating HTML output with components, styling the components, using material ui and bootstrap, basic navigation with routing
2. Introducing and displaying data from the components, handling events, component composition
3. Form processing
4. Service layers
5. Handling asynchronity, REST layers
6. Authentication and authorization
7. Testing



[1]: https://angular.io/
[2]: https://cli.angular.io/
[3]: https://nodejs.org/
[4]: https://angular.io/guide/quickstart#project-file-review
[5]: https://angular.io/guide/displaying-data#showing-an-array-property-with-ngfor
[6]: http://localhost:4200

[7]: https://material.angular.io/
[8]: https://github.com/angular/flex-layout
[9]: http://getbootstrap.com/docs/4.0/getting-started/introduction/