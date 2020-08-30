interface HSB {
  hue: number;
  sat: number;
  bri: number;
}

interface OnOff {
  on: boolean;
}

interface Action extends HSB, OnOff {
  effect: string;
  xy: [
    number,
    number
  ],
  ct: number;
  alert: 'select';
  colormode: 'xy'|'hs';
}

export {
  HSB,
  OnOff,
  Action
};
