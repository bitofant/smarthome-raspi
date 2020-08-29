import logger from 'standalone-logger';
const log = logger(module);

import express from 'express';
import hue from './hue';

const nodeActions = express.Router();

nodeActions.get('/', (req, res) => {
  res.send('hello there');
});

nodeActions.get('/:nodemcu/:button/', (req, res) => {
  log(req.params.nodemcu + ' / ' + req.params.button);
  res.send('+OK');
});

export default nodeActions;
