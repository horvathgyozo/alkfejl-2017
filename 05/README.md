# 5. gyakorlat: A TypeScript nyelv

[TypeScript honlap][ts honlap]

## Bevezetés

- JavaScript
- TypeScript

## Futtató környezet

- böngésző (JavaScript)
- parancssor, Node.js (JavaScript)
- REPL: [TypeScript Playground]

## Szerkesztő

- Visual Studio Code

## Lokális futtatás

```sh
npm install typescript
./node_modules/.bin/tsc file.ts
node file.js
```

Továbbfejlesztve:

```sh
npm install nodemon
# console 1
./node_modules/.bin/tsc --watch file.ts
# console 2
./node_modules/.bin/nodemon file.js
```

Vagy mindezt előkészítve használhatjuk [ezt a kódtárat](https://github.com/vimtaai/typescript-repl) letöltve.


## Feladatok

0. Adatszerkezetek, típusok
1. Összeadó függvény
2. Kiválogatás evolúció
    + Saját fgv.
    + Általánosított
    + `filter`
3. Osztályok és interfészek
    + objektumokkal dolgozó függvények
    + osztályok
    + öröklés, `super`
    + public paraméter
    + interfész implementálása
4. Generic-ek
5. Castolás (`as`)
6. JSON értelmezés


[ts honlap]: https://www.typescriptlang.org/
[ts docs]: https://www.typescriptlang.org/docs/home.html
[ts in 5 minutes]: https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html
[ts handbook]: https://www.typescriptlang.org/docs/handbook/basic-types.html
[TypeScript Playground]: https://www.typescriptlang.org/play/index.html 
[jsbin]: http://jsbin.com
[ES6 console]: https://es6console.com/