import logger from 'standalone-logger';
const log = logger(module);

import express from 'express';
import hue from './hue';

const hueActions = express.Router();

hueActions.use((req, res, next) => {
  log(req.url);
  next();
});

hueActions.get('/', (req, res) => {
  res.json({
    ip: hue.ip,
    user: hue.user
  });
});

hueActions.get('/connect/', (req, res) => {
  log('connection request');
  hue.connect();
  res.send('connecting...');
});

hueActions.get('/ip/', (req, res) => {
  log('ip request: ' + hue.ip);
  res.send(hue.ip);
});

hueActions.get('/ip/:ip', (req, res) => {
  log('set ip request: ' + req.params.id);
  res.json({
    old: hue.ip,
    new: req.params.ip
  });
  hue.ip = req.params.ip;
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


hueActions.get('/groups/', (req, res) => {
  hue
    .getGroups()
    .then(groups => res.json(groups))
    .catch(err => res.status(503).json(err));
});

hueActions.get('/set/:group/:hue/:sat/:bri', (req, res) => {
  log('asfd');
  hue
    .setGroup(
      req.params.group,
      {
        hue: parseInt(req.params.hue),
        sat: parseInt(req.params.sat),
        bri: parseInt(req.params.bri)
      }
    )
    .then(obj => res.json(obj))
    .catch(err => res.status(503).json(err));
});

hueActions.get('/blink/:group/:times', (req, res) => {
  hue.blink(req.params.group, parseInt(req.params.times));
  res.json({'o':'k'});
});

export default hueActions;
