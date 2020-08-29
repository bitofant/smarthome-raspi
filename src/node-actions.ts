import logger from 'standalone-logger';
const log = logger(module);

import express from 'express';
import hue from './hue';

const nodeActions = express.Router();

nodeActions.get('/', (req, res) => {
  res.send('hello there');
});

nodeActions.get('/:nodemcu/:button/', (req, res) => {
  let nodeMcu = req.params.nodemcu;
  let button = req.params.button;
  res.send('+OK');
  if (button == "1") {
    hue.setGroup("Bedroom", '0', '0', '254');
  } else if (button == "2") {
    hue.setGroup("Bedroom", '0', '0', '0');
  }
});

export default nodeActions;
