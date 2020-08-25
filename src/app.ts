import logger, { loggerExpressEndpoint, LoggerSettings } from 'standalone-logger';
LoggerSettings.logfile = 'dist/log';
const log = logger(module);

import express from 'express';
import hueActions from './hue-actions';
const app = express();

app.get('/', (req, res) => {
  res.send('works!');
});

app.use('/log/', loggerExpressEndpoint);
app.use('/hue/', hueActions);

app.listen(8080, () => {
  log('listening on :8080');
});
