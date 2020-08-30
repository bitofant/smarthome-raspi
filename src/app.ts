import fs from 'fs';
if (!fs.existsSync('dist/config')) fs.mkdirSync('dist/config');
import logger, { loggerExpressEndpoint, LoggerSettings } from 'standalone-logger';
LoggerSettings.logfile = 'dist/config/log';
const log = logger(module);

import express from 'express';
import hueActions from './hue-actions';
import nodeActions from './node-actions';
const app = express();

app.get('/', (req, res) => {
  res.send('works!');
});

app.use('/log/', loggerExpressEndpoint);
app.use('/hue/', hueActions);
app.use('/node/', nodeActions);

app.listen(8080, () => {
  log('listening on :8080');
});
