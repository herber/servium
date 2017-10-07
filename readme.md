# servium [![Build Status](https://travis-ci.org/tobihrbr/servium.svg?branch=master)](https://travis-ci.org/tobihrbr/servium) [![codecov](https://codecov.io/gh/tobihrbr/servium/badge.svg?branch=master)](https://codecov.io/gh/tobihrbr/servium?branch=master)

> A small http server

## Install

```
$ npm install servium
```

## Usage

```js
const servium = require('servium');
const app = servium();

app.use((req, res, next) => {
  req.custom = {};

  next();
});

app.get('/path', (req, res) => {
  res.end('response');
});

app.listen(3000);
```

## API

### servium()

#### use([path, ] ...fns)

> Will be called on every request.

##### path

Type: `string`

The middleware path.

##### fns

Type: `function`

One ore more middleware functions.

#### get([path, ] ...fns)

> Will be called for get requests.

##### path

Type: `string`

The middleware path.

##### fns

Type: `function`

One ore more middleware functions.

#### post([path, ] ...fns)

> Will be called for post requests.

##### path

Type: `string`

The middleware path.

##### fns

Type: `function`

One ore more middleware functions.

#### put([path, ] ...fns)

> Will be called for put requests.

##### path

Type: `string`

The middleware path.

##### fns

Type: `function`

One ore more middleware functions.

#### patch([path, ] ...fns)

> Will be called for patch requests.

##### path

Type: `string`

The middleware path.

##### fns

Type: `function`

One ore more middleware functions.

#### delete([path, ] ...fns)

> Will be called for delete requests.

##### path

Type: `string`

The middleware path.

##### fns

Type: `function`

One ore more middleware functions.

## License

MIT © [Tobias Herber](http://tobihrbr.com)
