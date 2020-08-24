import logger, { loggerExpressEndpoint, LoggerSettings } from 'standalone-logger';
LoggerSettings.logfile = 'dist/log';
const log = logger(module);

import express from 'express';
const app = express();

app.get('/', (req, res) => {
  res.send('works!');
});
app.use('/log/', loggerExpressEndpoint);

app.listen(8080, () => {
  log('listening on :8080');
});
