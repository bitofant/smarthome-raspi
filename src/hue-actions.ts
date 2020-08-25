import logger from 'standalone-logger';
const log = logger(module);

import express from 'express';
import hue from './hue';

const hueActions = express.Router();

hueActions.use((req, res, next) => {
  log(req.url);
  next();
});

hueActions.get('/connect/', (req, res) => {
  log('connection request');
  hue.connect();
  res.send('connecting...');
});

hueActions.get('/user/', (req, res) => {
  log('user request: ' + hue.user);
  res.send(hue.user);
});

hueActions.get('/user/:id', (req, res) => {
  log('set user request: ' + req.params.id);
  res.json({
    old: hue.user,
    new: req.params.id
  });
  hue.user = req.params.id;
});

export default hueActions;
