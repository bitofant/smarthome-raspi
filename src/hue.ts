import logger from 'standalone-logger';
const log = logger(module);
import request from 'request';
process.env["NODE_TLS_REJECT_UNAUTHORIZED"] = '0';
import fs from 'fs';
import { Group } from './hue-types/group';
import { Action, OnOff, HSB } from './hue-types/action';

const DEVICE_ID = 'smarthome#raspi';

interface HueError {
  error: {
    type: number;
    address: string;
    description: string;
  }
}

function isError(obj: any): obj is HueError {
  return typeof(obj) === 'object'
    && typeof(obj.error) === 'object'
    && typeof(obj.error.type) === 'number';
}

class Hue {
  private _ip = '';
  private _user = '';
  set ip(value: string) {
    this._ip = value;
    log('ip updated to ' + value);
  }
  get ip() {
    return this._ip;
  }
  set user(value: string) {
    this._user = value;
    fs.writeFile('dist/config/userid', this.user, 'utf8', err => {
      if (err) log(err);
      else log('user id persisted to dist/config/userid');
    });
  }
  get user() {
    return this._user;
  }

  constructor() {
    findHueIpAddress();
    if (fs.existsSync('dist/config/userid')) {
      this._user = fs.readFileSync('dist/config/userid', 'utf8');
    }
  }

  public connect() {
    log('connecting...');
    this.connectAndRetry()
      .then((response: {success:{username:string}}) => {
        this.user = response.success.username;
      })
      .catch(err => {
        log(err);
      });
  }

  private connectAndRetry() {
    return new Promise<{success:{username:string}}>((resolve, reject) => {
      let t_start = Date.now();
      let timer : NodeJS.Timeout;
      const self = this;
      function tryAgain() {
        if (Date.now() > t_start + 60000) {
          reject(new Error('timeout'));
          return;
        }
        self.tryConnect()
          .then(response => {
            resolve(response);
          })
          .catch(err => {
            log(err);
            setTimeout(tryAgain, 5000);
          });
      }
      timer = setTimeout(tryAgain, 500);
    });
  }

  private tryConnect() {
    return new Promise<{success:{username:string}}>((resolve, reject) => {
      request.post(`https://${this.ip}/api`, {
        headers: {
          'Content-type': 'text/json'
        },
        body: JSON.stringify({
          devicetype: DEVICE_ID
        })
      }, (err, response, body) => {
        if (err) {
          reject(err);
          return;
        }
        if (response.statusCode !== 200) {
          reject(new Error('http # ' + response.statusCode));
          return;
        }
        let parsed = JSON.parse(body)[0];
        if (isError(parsed)) {
          reject(parsed);
        } else if (typeof(parsed.success?.username) === 'string') {
          resolve(parsed);
        } else {
          reject(new Error('unknown response format: ' + body));
        }
      });
    });
  }

  public async getGroups() {
    return this.get<{[index: string]: Group}>('groups');
  }

  public async getGroup(groupName: string) {
    let groups = await this.getGroups();
    for (let key in groups) {
      if (groups[key].name.toLowerCase() === groupName.toLowerCase()) {
        return {
          groupId: parseInt(key),
          group: groups[key]
        };
      }
    }
    throw new Error('group "' + groupName + '" not found');
  }

  private async getGroupId(groupName: string) {
    return (await this.getGroup(groupName)).groupId;
  }

  public async setGroup(groupName: string|number, action: HSB | OnOff) {
    let id = typeof(groupName) === "number"
      ? groupName
      : await this.getGroupId(groupName);
    log(`set group ${id} to ${JSON.stringify(action)}`);
    return await this.put(`groups/${id}/action`, action);
  }

  public async blink(groupName: string, times: number) {
    for (let i = 0; i < times; ++i) {
      setTimeout(() => this.setGroup(groupName, {
        hue: 0,
        sat: 0,
        bri: 254
      }), i * 500);
      setTimeout(() => this.setGroup(groupName, {
        hue: 0,
        sat: 0,
        bri: 0
      }), i * 500 + 250);
    }
  }

  private async get<T>(method: string, body?: object) {
    return this.api<T>('get', method, body);
  }
  private async put<T>(method: string, body?: object) {
    return this.api<T>('put', method, body);
  }

  private async api<T>(httpMethod: 'get'|'put'|'post', method: string, body?: object) {
    return new Promise<T>((resolve, reject) => {
      request[httpMethod](`https://${this.ip}/api/${this.user}/${method}`, {
        headers: {
          "Content-type": 'text/json'
        },
        body: typeof(body) === 'undefined' ? undefined : JSON.stringify(body)
      }, (err, res, body) => {
        if (err) {
          reject(err);
        } else if (res.statusCode !== 200) {
          reject(new Error('http status ' + res.statusCode));
        } else {
          resolve(JSON.parse(body));
        }
      });
    });
  }
}

const hue = new Hue();

function findHueIpAddress() {
  request.get('https://discovery.meethue.com/', (err, response, body) => {
    if (err) {
      log(err);
      return;
    }
    if (response.statusCode !== 200) {
      log(new Error('http # ' + response.statusCode));
      return;
    }
    let config = JSON.parse(body);
    hue.ip = config[0].internalipaddress;
  });
}

export default hue;
