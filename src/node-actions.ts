import logger from 'standalone-logger';
const log = logger(module);

import express from 'express';
import hue from './hue';
import { toggleRoom, COLORS } from './hue-convenience';

const nodeActions = express.Router();

nodeActions.get('/', (req, res) => {
  res.send('hello there');
});

/*
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
*/

nodeActions.get('/door/0/', (req, res) => {
  res.send('+OK');
  toggleRoom('Bedroom', COLORS.bright);
});

nodeActions.get('/door/1/', (req, res) => {
  res.send('+OK');
  toggleRoom('Bedroom', COLORS.dim);
});

nodeActions.get('/door/2/', (req, res) => {
  res.send('+OK');
});

export default nodeActions;
