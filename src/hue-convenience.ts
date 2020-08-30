import logger from 'standalone-logger';
const log = logger(module);

import hue from "./hue";
import { HSB, OnOff } from './hue-types/action';


const COLORS = {
  bright: {
    hue: 8402,
    sat: 140,
    bri: 254
  } as HSB,
  dim: {
    hue: 8402,
    sat: 140,
    bri: 77
  } as HSB,
  night: {
    hue: 8402,
    sat: 140,
    bri: 1
  } as HSB
};

async function toggleRoom(name: string, color?: HSB) {
  let { groupId, group } = await hue.getGroup(name);
  let previousState = group.action.on;
  let previousColor : HSB = group.action;
  let state = !previousState;
  if (!color || isSameColor(color, previousColor)) {
    hue.setGroup(groupId, { on: state });
  } else {
    hue.setGroup(groupId, Object.assign(
      color,
      { on: true }
    ));
  }
}

function isSameColor(color1: HSB, color2: HSB) {
  return color1.hue === color2.hue
    && color2.sat === color2.sat
    && color1.bri === color2.bri;
}

export { toggleRoom, COLORS };
