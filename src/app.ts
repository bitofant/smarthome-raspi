import logger, { loggerExpressEndpoint, LoggerSettings } from 'standalone-logger';
LoggerSettings.logfile = 'dist/log';
const log = logger(module);

import express from 'express';
const app = express();

log('attaching logger endpoint...');
app.use('/log/', loggerExpressEndpoint);

app.listen(8080, () => {
  log('listening on :8080');
});
