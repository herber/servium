const ava = require('ava');
const fetch = require('node-fetch');
const server = require('./index.js');
const middleware = require('./middleware.js');

ava('runs middleware', t => {
  t.plan(7);

  const m = middleware();

  m.use((a, b, next) => {
    t.is(a, '1');
    t.is(b.a, '2');
    next();
  });

  m.use((a, b, next) => {
    t.is(a, '1');
    t.is(b.a, '2');
    b.b = '3';
    next();
  });

  m.run('1', { a: '2' }, (err, a, b) => {
    t.is(a, '1');
    t.is(b.a, '2');
    t.is(b.b, '3');
  });
});

ava('runs middleware with no callback', t => {
  t.plan(2);

  const m = middleware();

  m.use((a, next) => {
    t.is(a, '1');
    next();
  });

  m.use((a, next) => {
    t.is(a, '1');
    next();
  });

  m.run('1');
});

ava('runs middleware with multiple functions passed by m.use', t => {
  t.plan(7);

  const m = middleware();

  m.use(
    (a, next) => {
      t.is(a, '1');
      next();
    },
    (a, next) => {
      t.is(a, '1');
      next();
    },
    (a, next) => {
      t.is(a, '1');
      next();
    }
  );

  m.use((a, next) => {
    t.is(a, '1');
    next();
  });

  m.use(
    (a, next) => {
      t.is(a, '1');
      next();
    },
    (a, next) => {
      t.is(a, '1');
      next();
    }
  );

  m.run('1', (err, a) => {
    t.is(a, '1');
  });
});

ava('runs middleware with error', t => {
  t.plan(4);

  const m = middleware();

  m.use((a, next) => {
    t.is(a, '1');
    next();
  });

  m.use((a, next) => {
    t.is(a, '1');
    next(new Error('We are going to die.'));
  });

  m.use((a, next) => {
    t.fail();
    next();
  });

  m.run('1', (err, a) => {
    t.true(err instanceof Error);
    t.is(a, '1');
  });
});

ava('listens to requests / parses routes', t => {
  const port = Math.floor(Math.random() * 60000 + 1025);
  const s = server();

  t.plan(8);

  s.use(
    '/test/route/:id/:id2/end',
    (req, res, next) => {
      t.is(req.params.id, 'id-1-str');
      t.is(req.params.id2, 'id-2-str');

      res.end('middleware 1');

      next();
    },
    () => {
      t.true(true);
    }
  );

  s.use(
    (req, res, next) => {
      t.true(true);

      res.end('middleware 2');

      next();
    },
    () => {
      t.true(true);
    }
  );

  s.listen(port, () => {
    t.true(true);
  });

  return fetch(`http://localhost:${port}`)
    .then(function(res) {
      return res.text();
    })
    .then(function(text) {
      t.is(text, 'middleware 2');
    })
    .then(() =>
      fetch(`http://localhost:${port}/test/route/id-1-str/id-2-str/end`)
        .then(function(res) {
          return res.text();
        })
        .then(function(text) {
          t.is(text, 'middleware 1');
        })
    );
});

ava('serves methods', t => {
  const port = Math.floor(Math.random() * 60000 + 1025);
  const s = server();

  t.plan(7);

  s.get('/path', (req, res) => {
    res.end('get');
  });

  s.get((req, res) => {
    res.end('otherget');
  });

  s.post('/p1', (req, res) => {
    res.end('post');
  });

  s.put('/p1', (req, res) => {
    res.end('put');
  });

  s.patch('/p2', (req, res) => {
    res.end('patch');
  });

  s.delete('/p2', (req, res) => {
    res.end('delete');
  });

  s.listen(port, () => {
    t.true(true);
  });

  /* eslint-disable */
  return fetch(`http://localhost:${port}/path`)
    .then(function(res) {
      return res.text();
    })
    .then(function(text) {
      t.is(text, 'get');
    })
    .then(() => {
      return fetch(`http://localhost:${port}`)
        .then(function(res) {
          return res.text();
        })
        .then(function(text) {
          t.is(text, 'otherget');
        })
        .then(() => {
          return fetch(`http://localhost:${port}/p1`, { method: 'post' })
            .then(function(res) {
              return res.text();
            })
            .then(function(text) {
              t.is(text, 'post');
            })
            .then(() => {
              return fetch(`http://localhost:${port}/p1`, { method: 'put' })
                .then(function(res) {
                  return res.text();
                })
                .then(function(text) {
                  t.is(text, 'put');
                })
                .then(() => {
                  return fetch(`http://localhost:${port}/p2`, { method: 'patch' })
                    .then(function(res) {
                      return res.text();
                    })
                    .then(function(text) {
                      t.is(text, 'patch');
                    })
                    .then(() => {
                      return fetch(`http://localhost:${port}/p2`, { method: 'delete' })
                        .then(function(res) {
                          return res.text();
                        })
                        .then(function(text) {
                          t.is(text, 'delete');
                        });
                    });
                });
            });
        });
    });
  /* eslint-enable */
});
