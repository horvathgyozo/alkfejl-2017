# Web engineering practice -- The TypeScript language

> TypeScript is a typed superset of JavaScript that compiles to plain JavaScript.

JavaScript is dynamic, weakly typed, interpreted language. TypeScript brings static types and compilation into the language. Advantages:

- type errors during compilation
- enhanced code completion

## Documentation

- [TypeScript webpage][ts honlap]
- [TypeScript documentation][ts docs]
- [TypeScript in 5 minutes][ts in 5 minutes] (Getting started)
- [TypeScript handbook][ts handbook] (detailed descriptions)

## Editor

Visual Studio Code is tailored for editing TypeScript code.

## Trying out

### Online REPL

[TypeScript Playground]

### Local compilation and execution

```sh
npm install typescript
./node_modules/.bin/tsc file.ts
node file.js
```

### Local REPL

```sh
npm install nodemon
# console 1
./node_modules/.bin/tsc --watch file.ts
# console 2
./node_modules/.bin/nodemon file.js
```

## Examples

### JavaScript is a subset of TypeScript

```js
function add(a, b) {
    return a + b;
}
const c = add(3, 5);
```

### Variables and constants

```js
const i: number = 12;
const s: string = "apple";
const b: boolean = true;

// Type annotation is optional
const j = 13;
```

### Functions

```js
function add(a: number, b: number): number {
    return a + b;
}
const c: number = add(3, 5);
```

### Interfaces

```js
interface Person {
    firstName: string;
    lastName: string;
}

function greeter(person: Person) {
    return "Hello, " + person.firstName + " " + person.lastName;
}

let user = { firstName: "Jane", lastName: "User" };

console.log(greeter(user));
```

### Generics and classes

```js
interface IBinaryTree<T> {
  isEmpty(): boolean;
  createNode(value: T): void;
  Value: T; //???
  Left: IBinaryTree<T>;
  Right: IBinaryTree<T>;
}

interface IBinaryTreeNode<T> {
  value: T;
  left: IBinaryTree<T>;
  right: IBinaryTree<T>;
}

class BinaryTree<T> implements IBinaryTree<T> {
  private root: IBinaryTreeNode<T> = null;
  constructor(value?: T) {
    if (value) {
      this.createNode(value);
    }
  }

  isEmpty(): boolean {
    return this.root === null;
  }

  createNode(value: T): void {
    this.root = {
      value,
      left: new BinaryTree<T>(),
      right: new BinaryTree<T>()
    };
  }

  get Value(): T {
    return this.root.value;
  }

  set Value(value: T) {
    this.root.value = value;
  }

  get Left(): IBinaryTree<T> {
    return this.root.left;
  }

  set Left(value: IBinaryTree<T>) {
    this.root.left = value;
  }

  get Right(): IBinaryTree<T> {
    return this.root.right;
  }

  set Right(value: IBinaryTree<T>) {
    this.root.right = value;
  }
}

type BinFa = BinaryTree<number>;

let f1: BinFa, f2: BinFa, f3: BinFa;

f1 = new BinaryTree();
f1.createNode(3);

f2 = new BinaryTree(5);
f3 = new BinaryTree(10);

f1.Left = f2;
f1.Right = f3;

console.log(f1.Value, f1.Left.Value, f1.Right.Value);
console.log(f1.Left.Left.isEmpty());
```

## Tasks

1. Define a variable with each basic type!

2. Count

Define the `count` function, if we would like to use it in this way:

```ts
count([1, 11, 22, 4, 33], e => e % 2 === 0);
count(['alma', 'korte', 'szilva'], e => e.startsWith('a'));
```

3. What is the difference between the `var`, `let` and `const` keywords?

4. Define the `Square` and `Circle` classes which implement a common interface called `IShape`!

```ts
interface IShape {
    getArea(): number;
}
```

5. Define a generic Stack<T> class!

6. Define a specific stack called OrderBook that can only store IOrder instances!

7. Define a generic BinaryTree class!

```ts
let bt: BinaryTree<number>;
```

8. Define a generic LinkedList class!

9. Put these solutions into multiple files with the right import/export syntax!

10. Define a [decorator] that adds a static field indicating that the subject has been decorated!



[ts honlap]: https://www.typescriptlang.org/
[ts docs]: https://www.typescriptlang.org/docs/home.html
[ts in 5 minutes]: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
[ts handbook]: https://www.typescriptlang.org/docs/handbook/basic-types.html
[TypeScript Playground]: https://www.typescriptlang.org/play/index.html 
