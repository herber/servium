// Builtin
const http = require('http');
const url = require('url');

// Packages
const routeParser = require('route-parser');

// Ours
const middleware = require('./middleware.js');

const server = () => {
  const mw = middleware();

  const use = (path, ...fns) => {
    if (typeof path === 'function') return mw.use(path, ...fns);

    const route = new routeParser(path);

    for (const fn in fns) {
      mw.use((req, res, next) => {
        const match = route.match(url.parse(req.url).pathname);

        if (match !== false) {
          req.params = match;
          fns[fn](req, res, next);
        } else {
          next();
        }
      });
    }
  };

  const all = use;

  const handle = method => (path, ...fns) => {
    if (typeof path === 'function') {
      fns = [path].concat(fns);
      path = '/*';
    }

    use(path, (req, res, next) => {
      if (req.method.toLowerCase() === method) {
        const m = middleware();

        m.use(...fns);
        m.run(req, res, next);
      } else {
        next();
      }
    });
  };

  const methods = {};

  methods.get = handle('get');
  methods.post = handle('post');
  methods.put = handle('put');
  methods.patch = handle('patch');
  methods.delete = handle('delete');

  const server = http.createServer((req, res) => {
    req.params = {};
    mw.run(req, res);
  });

  return Object.assign(server, { use, all }, methods);
};

module.exports = server;
