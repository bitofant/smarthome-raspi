import { Action } from "./action";

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
  action: Action;
}

export { Group };
