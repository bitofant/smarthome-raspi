import fs from 'fs';
if (!fs.existsSync('dist/config')) fs.mkdirSync('dist/config');
import logger, { loggerExpressEndpoint, LoggerSettings } from 'standalone-logger';
LoggerSettings.logfile = 'dist/config/log';
const log = logger(module);

import express from 'express';
import hueActions from './hue-actions';
import nodeActions from './node-actions';
const app = express();

// app.use((req, res, next) => {
//   if (!req.url.startsWith('/log/')) {
//     log(`express::${req.method}::${req.url}`);
//   }
//   next();
// });

app.get('/', (req, res) => {
  res.send('works!');
});

app.get('/commit/', (req, res) => {
  fs.readFile('.git/FETCH_HEAD', 'utf8', (err, data) => {
    if (err) {
      res.status(503).json(err);
    } else {
      res.send(/^([0-9,a-f,A-F]+)\s/.exec(data)?.pop());
    }
  });
});

app.use('/log/', loggerExpressEndpoint);
app.use('/hue/', hueActions);
app.use('/node/', nodeActions);

app.listen(8080, () => {
  log('listening on :8080');
});
