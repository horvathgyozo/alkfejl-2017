# JavaScript - Asynchrony

## Table of contents

- Synchronous and asynchronous processes
- Callback functions
- Promises
- Generator functions
- Async-await functions

## References

- [Asynchronous JavaScript](https://blog.risingstack.com/asynchronous-javascript/)

## Asynchrony

- parallel (operations at the same time, threads)
- concurrency (tasks, in the same time interval)

## Synchronous and asynchronous processes

JavaScript is single threaded. When you call a function, the execution of the function starts, and the caller will wait until the function ends, and then will continue its own execution. This mechanism uses the call stack.

```js
function a() {
    console.log('a starts');
    b();
    console.log('a ends');
}

function b() {
    console.log('b starts');
    console.log('b is working');
    console.log('b ends');   
}
```

But there are cases when waiting is not effective. For example, when you start a timer, you actually do not want to wait, until the timer starts, but want to continue other logic. When you register an event handler, you do not wait the event to execute the event handler, but the main process continues. When you send an AJAX call, you do not want to wait for the answer, because it may take long, so you let your program continue doing its job. So there are asynchronous interfaces in the environments which are executing JavaScript code.

In the background, the environment (the browser or node.js) uses a so called [event loop](https://developer.mozilla.org/en-US/docs/Web/JavaScript/EventLoop). It uses a queue to store the codes (function) to be processed. In every iteration, it takes every element out of the queue one by one. Asynchronous interfaces put functions into the queue.

![The event loop (from the Exploringjs book)](http://exploringjs.com/es6/images/async----event_loop.jpg)

## Callback functions

The asynchronous interfaces usually use callback functions to handle asynchrony. Callback functions are just normal functions, which are passed to another function as a parameter, and that function will call the passed function parameter. Callback functions are not synchronous or asynchronous by nature. The interface, which uses them, is synchronous or asynchronous. For example, this is a synchronous usage of a callback function:

```js
function a(b) {
    b();
}
console.log('before a');
a(() => console.log('Callback function is called'));
console.log('after a');

// OR

[1, 3, 5].map(e => e * 2)
```

But, for example, timers are asynchronous by nature:

```js
// the environment defines setTimeout

// and somewhere in your code we use it
console.log('before timer');
setTimeout(() => {
    console.log('Callback function is called');
}, 1000);
console.log('after timer');
```

## Callback hell

Callbacks are just fine, but if we have a lot of asynchronous operations one after each other, we always have to wait for the callback function firing indicating that one operation finished, and after then start a new one. Applying e.g. many delays, it looks like this:

```js
setTimeout(() => {
    console.log('first timeout');
    setTimeout(() => {
        console.log('second timeout');
        setTimeout(() => {
            console.log('third timeout');
            setTimeout(() => {
                console.log('final timeout');
            },1000)
        }, 1000)
    }, 1000)
}, 1000)

// OR

function delay(ms, cb) {
    setTimeout(() => {
        console.log(`${ms} timeout`);
        cb(ms);
    }, ms)
}

delay(1000, ms => {
    console.log('first callback');
    delay(500, ms => {
        console.log('second callback');
        delay(2000, ms => {
            console.log('third callback');
            delay(800, ms => {
              console.log('fourth callback');
            })      
        })
    })
})
```

Node.js has an asynchronous API by nature, that is why it can be so fast. But node.js code can lead to unfollowable callback hells.

## Promises

A promise represents the result of an operation, which is unknown in the present. The promise may be succeed (resolve) or fail (reject). If it succeeds the result value can be obtained from the promise. A promise object has two methods, `then` and `catch` for the outcomes.

```js
function delay(ms) {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            console.log(`${ms} timeout`);
            resolve(ms);
        }, ms)
    });
}

// USING

delay(1000).then(ms => console.log('Result', ms));
```

If we rewrite our delay chain the callback hell remains:

```js
delay(1000).then(ms => {
    delay(500).then(ms => {
        delay(2000).then(ms => {
            delay(800).then(ms => {
                console.log('finally');
            })
        })
    })
})
```

But if something is returned from a promise callback, it is a new promise or a normal value which is wrapped into a promise. So the `then` method returns a promise representing the return value of the callback. With this information we can flatten or delay chain:

```js
delay(1000)
    .then(ms => { return delay(500);      })
    .then(ms => { return delay(2000);     })
    .then(ms => { return delay(800);      })
    .then(ms => { console.log('finally'); })
    .catch() {
        console.log('There are some errors');
    }
```

### Sequence

```js
const delays = [1000, 500, 2000, 800];
const items = [];

delays.reduce(
    (promise, ms) => promise.then(() => {
      items.push(ms)
      return delay(ms)
    }),
    Promise.resolve()
).then(
    () => console.log(items)
)
```

### Parallel

```js
const delays = [1000, 500, 2000, 800];
Promise.all(delays.map(ms => delay(ms))).then(result =>
    console.log(result)
)
```

### Race

```js
const delays = [1000, 500, 2000, 800];
Promise.race(delays.map(ms => delay(ms))).then(result =>
    console.log(result)
)
```

### Promisify

```js
const promisify = fn => (...args) => {
  return new Promise((resolve, reject) => {
    fn(...args, (err, data) => {
      if (err) reject(err);
      resolve(data);
    });
  });
}

// USAGE

const pReadFile = promisify(fs.readFile);
```


## Generator functions

Generator functions have nothing to do with asynchrony, but they -- as a tool -- can help handle asynchrony in a very convenient way. A generator function can interrupt its execution, returning to the caller code. Then the caller code can continue its execution. It provides this feature with the help of an iterator, which a generator function returns. We can declare a generator function with `function*` and interrupting it with the `yield` statement. `yield` is like `return`, but the execution of the function can be continued. 

```js
function* genAdder() {
  const a = yield 1;
  const b = yield 2;
  yield a + b;
  return 100;
}

const it = genAdder();   // function does not start
console.log(it.next())   // go to the first yield, returning 1
console.log(it.next(10)) // sending 10 as the value of the first yield, and execute until the second yield, returning 2
console.log(it.next(32)) // sending 32 to b, execute the function, returning 42
console.log(it.next())   // returning 100, the iterator in done state
```

We can make some interesting calculation:

```js
function* fibonacci() {
  let fn1 = 0;
  let fn2 = 1;
  while (true) {  
    let current = fn1;
    fn1 = fn2;
    fn2 = current + fn1;
    yield current;
  }
}

const it = fibonacci();
for (let i = 0; i<10; i++) {
    console.log(it.next().value);
}
```

In asynchronous code we can use generator functions to stop when an async operation starts, and when the promise resolves the function can continue its execution. For thiswe can use a small library, called `co`:

```js
const co = require('co');

co(function* () {
    let items = [];
    items.push( yield delay(1000) );
    items.push( yield delay(500) );
    items.push( yield delay(2000) );
    items.push( yield delay(800) );
    console.log(items);
})
```

## Async-await

The latter functionality is similar to a built-in language feature, called async functions. [From MDN](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/async_function):

> When an async function is called, it returns a Promise. When the async function returns a value, the Promise will be resolved with the returned value.  When the async function throws an exception or some value, the Promise will be rejected with the thrown value.
> 
> An async function can contain an `await` expression, that pauses the execution of the async function and waits for the passed Promise's resolution, and then resumes the async function's execution and returns the resolved value.
> 
> The purpose of async/await functions is to simplify the behavior of using promises synchronously and to perform some behavior on a group of Promises. Just as Promises are similar to structured callbacks, async/await is similar to combining generators and promises.

```js
async function lotOfDelays() {
    const items = [];
    items.push( await delay(1000) );
    items.push( await delay(500) );
    items.push( await delay(2000) );
    items.push( await delay(800) );
    console.log(items);
}

lotOfDelays();
```

### Sequence

```js
async function main(){
  const delays = [1000, 500, 2000];
  const items = [];
  for (let ms of delays) {
    const val = await delay(ms);
    items.push(val);
  }
  console.log(items)
}
```

## Parallel

```js
async function main(){
  const delays = [1000, 500, 2000];
  const promises = delays.map(ms => delay(ms));
  const items = await Promise.all(promises);
  console.log(items)
}
```


## Tasks

Try to solve these tasks in different ways:

a. With callback functions
b. With promises
c. With generator functions
d. With async-await functions

1. Some text files are given in a folder. Write a program that joins those text files into a new one. Read each file, put its content into an array, and write the joined elements into a new file.

2. Given a `username.csv` file with user names. Read this file, filter for the valid (not empty) user names, and write it back to the file system.

3. Given a folder full of images. Convert each image to a thumbnail in another folder. Search on npm for image manipulation (e.g. `jimp` does a good job). Save the image information to a local database (e.g. `nedb` can be used for that).
