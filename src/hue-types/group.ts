interface Group {
  name: string;
  lights: string[];
  sensors: string[];
  type: string;
  state: {
    all_on: boolean;
    any_on: boolean;
  },
  recycle: boolean;
  class: string;
  action: {
    on: boolean;
    bri: 213;
    hue: 5691;
    sat: 254;
    effect: string;
    xy: [
      number,
      number
    ],
    ct: number;
    alert: 'select';
    colormode: 'xy';
  }
}


// "name": "Living room",
// "lights": [
//   "5",
//   "3"
// ],
// "sensors": [],
// "type": "Room",
// "state": {
//   "all_on": true,
//   "any_on": true
// },
// "recycle": false,
// "class": "Living room",
// "action": {
//   "on": true,
//   "bri": 213,
//   "hue": 5691,
//   "sat": 254,
//   "effect": "none",
//   "xy": [
//     0.5756,
//     0.3954
//   ],
//   "ct": 500,
//   "alert": "select",
//   "colormode": "xy"
// }