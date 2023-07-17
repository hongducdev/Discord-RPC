"use strict";
var __create = Object.create;
var __defProp = Object.defineProperty;
var __getOwnPropDesc = Object.getOwnPropertyDescriptor;
var __getOwnPropNames = Object.getOwnPropertyNames;
var __getProtoOf = Object.getPrototypeOf;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __name = (target, value) => __defProp(target, "name", { value, configurable: true });
var __export = (target, all) => {
  for (var name in all)
    __defProp(target, name, { get: all[name], enumerable: true });
};
var __copyProps = (to, from, except, desc) => {
  if (from && typeof from === "object" || typeof from === "function") {
    for (let key of __getOwnPropNames(from))
      if (!__hasOwnProp.call(to, key) && key !== except)
        __defProp(to, key, { get: () => from[key], enumerable: !(desc = __getOwnPropDesc(from, key)) || desc.enumerable });
  }
  return to;
};
var __toESM = (mod, isNodeMode, target) => (target = mod != null ? __create(__getProtoOf(mod)) : {}, __copyProps(
  // If the importer is in node compatibility mode or this is not an ESM
  // file that has been converted to a CommonJS file using a Babel-
  // compatible transform (i.e. "__esModule" has not been set), then set
  // "default" to the CommonJS "module.exports" for node compatibility.
  isNodeMode || !mod || !mod.__esModule ? __defProp(target, "default", { value: mod, enumerable: true }) : target,
  mod
));
var __toCommonJS = (mod) => __copyProps(__defProp({}, "__esModule", { value: true }), mod);

// src/index.ts
var src_exports = {};
__export(src_exports, {
  Client: () => client_default,
  default: () => src_default
});
module.exports = __toCommonJS(src_exports);

// src/client.ts
var import_events2 = require("events");
var import_timers = require("timers");

// src/constants.ts
function keyMirror(arr) {
  const tmp = {};
  for (const value of arr) {
    tmp[value] = value;
  }
  return tmp;
}
__name(keyMirror, "keyMirror");
var RPCCommands = keyMirror([
  "DISPATCH",
  "AUTHORIZE",
  "AUTHENTICATE",
  "GET_GUILD",
  "GET_GUILDS",
  "GET_CHANNEL",
  "GET_CHANNELS",
  "CREATE_CHANNEL_INVITE",
  "GET_RELATIONSHIPS",
  "GET_USER",
  "SUBSCRIBE",
  "UNSUBSCRIBE",
  "SET_USER_VOICE_SETTINGS",
  "SET_USER_VOICE_SETTINGS_2",
  "SELECT_VOICE_CHANNEL",
  "GET_SELECTED_VOICE_CHANNEL",
  "SELECT_TEXT_CHANNEL",
  "GET_VOICE_SETTINGS",
  "SET_VOICE_SETTINGS_2",
  "SET_VOICE_SETTINGS",
  "CAPTURE_SHORTCUT",
  "SET_ACTIVITY",
  "SEND_ACTIVITY_JOIN_INVITE",
  "CLOSE_ACTIVITY_JOIN_REQUEST",
  "ACTIVITY_INVITE_USER",
  "ACCEPT_ACTIVITY_INVITE",
  "INVITE_BROWSER",
  "DEEP_LINK",
  "CONNECTIONS_CALLBACK",
  "BRAINTREE_POPUP_BRIDGE_CALLBACK",
  "GIFT_CODE_BROWSER",
  "GUILD_TEMPLATE_BROWSER",
  "OVERLAY",
  "BROWSER_HANDOFF",
  "SET_CERTIFIED_DEVICES",
  "GET_IMAGE",
  "CREATE_LOBBY",
  "UPDATE_LOBBY",
  "DELETE_LOBBY",
  "UPDATE_LOBBY_MEMBER",
  "CONNECT_TO_LOBBY",
  "DISCONNECT_FROM_LOBBY",
  "SEND_TO_LOBBY",
  "SEARCH_LOBBIES",
  "CONNECT_TO_LOBBY_VOICE",
  "DISCONNECT_FROM_LOBBY_VOICE",
  "SET_OVERLAY_LOCKED",
  "OPEN_OVERLAY_ACTIVITY_INVITE",
  "OPEN_OVERLAY_GUILD_INVITE",
  "OPEN_OVERLAY_VOICE_SETTINGS",
  "VALIDATE_APPLICATION",
  "GET_ENTITLEMENT_TICKET",
  "GET_APPLICATION_TICKET",
  "START_PURCHASE",
  "GET_SKUS",
  "GET_ENTITLEMENTS",
  "GET_NETWORKING_CONFIG",
  "NETWORKING_SYSTEM_METRICS",
  "NETWORKING_PEER_METRICS",
  "NETWORKING_CREATE_TOKEN",
  "SET_USER_ACHIEVEMENT",
  "GET_USER_ACHIEVEMENTS"
]);
var RPCEvents = keyMirror([
  "CURRENT_USER_UPDATE",
  "GUILD_STATUS",
  "GUILD_CREATE",
  "CHANNEL_CREATE",
  "RELATIONSHIP_UPDATE",
  "VOICE_CHANNEL_SELECT",
  "VOICE_STATE_CREATE",
  "VOICE_STATE_DELETE",
  "VOICE_STATE_UPDATE",
  "VOICE_SETTINGS_UPDATE",
  "VOICE_SETTINGS_UPDATE_2",
  "VOICE_CONNECTION_STATUS",
  "SPEAKING_START",
  "SPEAKING_STOP",
  "GAME_JOIN",
  "GAME_SPECTATE",
  "ACTIVITY_JOIN",
  "ACTIVITY_JOIN_REQUEST",
  "ACTIVITY_SPECTATE",
  "ACTIVITY_INVITE",
  "NOTIFICATION_CREATE",
  "MESSAGE_CREATE",
  "MESSAGE_UPDATE",
  "MESSAGE_DELETE",
  "LOBBY_DELETE",
  "LOBBY_UPDATE",
  "LOBBY_MEMBER_CONNECT",
  "LOBBY_MEMBER_DISCONNECT",
  "LOBBY_MEMBER_UPDATE",
  "LOBBY_MESSAGE",
  "CAPTURE_SHORTCUT_CHANGE",
  "OVERLAY",
  "OVERLAY_UPDATE",
  "ENTITLEMENT_CREATE",
  "ENTITLEMENT_DELETE",
  "USER_ACHIEVEMENT_UPDATE",
  "SET_ACTIVITY",
  "READY",
  "ERROR"
]);

// src/util.ts
var import_process = __toESM(require("process"));
function pid() {
  if (typeof import_process.default !== "undefined") {
    return import_process.default.pid;
  }
  return null;
}
__name(pid, "pid");
var uuid4122 = /* @__PURE__ */ __name(() => (
  // @ts-ignore
  ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(
    /[018]/g,
    (a) => (a ^ Math.random() * 16 >> a / 4).toString(16)
  )
), "uuid4122");

// src/transports/ipc.ts
var import_net = __toESM(require("net"));
var import_events = __toESM(require("events"));
var import_node_fetch = __toESM(require("node-fetch"));
var OPCodes = {
  HANDSHAKE: 0,
  FRAME: 1,
  CLOSE: 2,
  PING: 3,
  PONG: 4
};
function getIPCPath(id) {
  if (process.platform === "win32") {
    return `\\\\?\\pipe\\discord-ipc-${id}`;
  }
  const {
    env: { XDG_RUNTIME_DIR, TMPDIR, TMP, TEMP }
  } = process;
  const prefix = XDG_RUNTIME_DIR || TMPDIR || TMP || TEMP || "/tmp";
  return `${prefix.replace(/\/$/, "")}/discord-ipc-${id}`;
}
__name(getIPCPath, "getIPCPath");
function getIPC(id = 0, auto = true) {
  return new Promise((resolve, reject) => {
    const path = getIPCPath(id);
    const onerror = /* @__PURE__ */ __name(() => {
      if (id < 10 && auto) {
        resolve(getIPC(id + 1, auto));
      } else {
        reject(new Error("Could not connect"));
      }
    }, "onerror");
    const sock = import_net.default.createConnection(path, () => {
      sock.removeListener("error", onerror);
      resolve({
        id,
        sock
      });
    });
    sock.once("error", onerror);
  });
}
__name(getIPC, "getIPC");
function encode(op, data) {
  const dataStr = JSON.stringify(data);
  const len = Buffer.byteLength(dataStr);
  const packet = Buffer.alloc(8 + len);
  packet.writeInt32LE(op, 0);
  packet.writeInt32LE(len, 4);
  packet.write(dataStr, 8, len);
  return packet;
}
__name(encode, "encode");
var working = {
  full: "",
  op: void 0
};
function decode(socket, callback) {
  const packet = socket.read();
  if (!packet) {
    return;
  }
  let { op } = working;
  let raw;
  if (working.full === "") {
    op = working.op = packet.readInt32LE(0);
    const len = packet.readInt32LE(4);
    raw = packet.slice(8, len + 8).toString();
  } else {
    raw = packet.toString();
  }
  try {
    const data = JSON.parse(working.full + raw);
    callback({ op, data });
    working.full = "";
    working.op = void 0;
  } catch (err) {
    working.full += raw;
  }
  decode(socket, callback);
}
__name(decode, "decode");
var IPCTransport = class extends import_events.default {
  static {
    __name(this, "IPCTransport");
  }
  client;
  socket;
  ipcId;
  _expecting = /* @__PURE__ */ new Map();
  clientId;
  user;
  activity;
  assets;
  config;
  application;
  constructor(client) {
    super();
    this.client = client;
    this.socket = null;
    this.ipcId = 0;
  }
  async connect(ipcId) {
    const data = await getIPC(ipcId ?? this.ipcId, ipcId ? false : true);
    this.ipcId = data.id;
    const socket = this.socket = data.sock;
    socket.on("close", this.onClose.bind(this));
    socket.on("error", this.onClose.bind(this));
    this.emit("open");
    socket.write(
      encode(OPCodes.HANDSHAKE, {
        v: 1,
        client_id: this.clientId
      })
    );
    socket.pause();
    socket.on("readable", () => {
      decode(socket, ({ op, data: data2 }) => {
        switch (op) {
          case OPCodes.PING:
            this.send(data2, OPCodes.PONG);
            break;
          case OPCodes.FRAME:
            if (!data2) {
              return;
            }
            this.emit("message", data2);
            break;
          case OPCodes.CLOSE:
            this.emit("close", data2);
            break;
          default:
            break;
        }
      });
    });
  }
  fetchAssets() {
    return new Promise((resolve, reject) => {
      (0, import_node_fetch.default)(
        `https://discord.com/api/v9/oauth2/applications/${this.clientId}/assets`
      ).then((r) => {
        if (r.ok) {
          r.json().then((assets) => {
            this.assets = assets;
            resolve(this);
          });
        } else {
          reject(r);
        }
      }).catch(reject);
    });
  }
  fetchApplication() {
    return new Promise((resolve, reject) => {
      (0, import_node_fetch.default)(
        `https://discord.com/api/v9/oauth2/applications/${this.clientId}/rpc`
      ).then((r) => {
        if (r.ok) {
          r.json().then((data) => {
            this.application = data;
            resolve(this);
          });
        } else {
          reject(r);
        }
      }).catch(reject);
    });
  }
  parseImageAnyToAsset(image) {
    if (!image) {
      return null;
    }
    if (/\d{17,19}/.test(image)) {
      const asset = this.assets?.find((a) => a.id == image);
      if (asset) {
        return asset.name;
      } else {
        return null;
      }
    }
    if (image.startsWith("mp:external") && image.includes("/https/")) {
      return "https://" + image.split("/https/")[1];
    }
    if (image.startsWith("mp:")) {
      return image.replace("mp:", "https://media.discordapp.net/");
    }
    return image;
  }
  getActivity() {
    if (!this.activity) {
      return null;
    }
    const data = {
      state: this.activity.state,
      details: this.activity.details,
      startTimestamp: this.activity.timestamps?.start,
      endTimestamp: this.activity.timestamps?.end,
      largeImageKey: this.parseImageAnyToAsset(
        this.activity.assets?.large_image
      ),
      largeImageText: this.activity.assets?.large_text,
      smallImageKey: this.parseImageAnyToAsset(
        this.activity.assets?.small_image
      ),
      smallImageText: this.activity.assets?.small_text,
      instance: this.activity.flags == 1 ? true : false,
      partyId: this.activity.party?.id,
      partySize: this.activity.party?.size?.[0],
      partyMax: this.activity.party?.size?.[1],
      buttons: this.activity.buttons?.map((name, index) => ({
        label: name,
        url: this.activity?.metadata?.button_urls?.[index]
      })),
      raw: this.activity
    };
    return data;
  }
  onClose(e) {
    this.emit("close", e);
  }
  send(data, op = OPCodes.FRAME) {
    if (this.socket) {
      this.socket.write(encode(op, data));
    }
  }
  close() {
    return new Promise((r) => {
      this.once("close", r);
      this.send({}, OPCodes.CLOSE);
      if (this.socket) {
        this.socket.end();
      }
    });
  }
  ping() {
    this.send(uuid4122(), OPCodes.PING);
  }
  setActivity(args, pid2) {
    return this.client.setActivity(args, pid2, this.ipcId);
  }
  clearActivity(pid2) {
    return this.client.clearActivity(pid2, this.ipcId);
  }
};
var ipc_default = IPCTransport;

// src/client.ts
var RPCClient = class extends import_events2.EventEmitter {
  static {
    __name(this, "RPCClient");
  }
  transports = /* @__PURE__ */ new Map();
  constructor() {
    super();
  }
  connect(clientId, id = this.transports.size) {
    const promise = new Promise((resolve, reject) => {
      const transport = new ipc_default(this);
      transport.clientId = clientId;
      function handleMessage(message) {
        if (message.cmd === RPCCommands.DISPATCH && message.evt === RPCEvents.READY) {
          if (message.data.user) {
            this.user = message.data.user;
            this.config = message.data.config;
          }
          Promise.all([
            this.fetchAssets(),
            this.fetchApplication()
          ]).then(() => {
            this.client.emit("connected", this);
          });
        } else if (this._expecting.has(message.nonce)) {
          const { resolve: resolve2, reject: reject2 } = this._expecting.get(
            message.nonce
          );
          if (message.evt === "ERROR") {
            const e = new Error(message.data.message);
            e.code = message.data.code;
            e.data = message.data;
            reject2(e);
          } else {
            if (message.cmd === RPCEvents.SET_ACTIVITY) {
              this.activity = message.data;
            }
            resolve2(message.data);
          }
          this._expecting.delete(message.nonce);
        } else {
          this.client.emit(message.evt, message.data);
        }
      }
      __name(handleMessage, "handleMessage");
      transport.on("message", handleMessage.bind(transport));
      const timeout = (0, import_timers.setTimeout)(
        () => reject(new Error("RPC_CONNECTION_TIMEOUT")),
        1e4
      );
      timeout.unref();
      function handleConnected(transport_) {
        if (transport.ipcId === transport_.ipcId) {
          (0, import_timers.clearTimeout)(timeout);
          this.transports.set(transport.ipcId, transport);
          resolve(transport);
          this.removeListener("connected", handleConnected);
        }
      }
      __name(handleConnected, "handleConnected");
      this.on("connected", handleConnected.bind(this));
      transport.once("close", () => {
        transport._expecting.forEach((e) => {
          e.reject(new Error("connection closed"));
        });
        this.emit("disconnected", transport);
        this.transports.delete(transport.ipcId);
        reject(new Error("connection closed"));
      });
      transport.connect(id).catch(reject);
    });
    return promise;
  }
  async login({ clientId, ipcId } = {}) {
    const transport = await this.connect(clientId, ipcId);
    this.emit("ready", transport);
    return transport;
  }
  request(ipcId = 0, cmd, args) {
    return new Promise((resolve, reject) => {
      const nonce = uuid4122();
      const transport = this.transports.get(ipcId);
      if (!transport) {
        return reject(new Error(`ID ${ipcId} is not connected`));
      }
      if (cmd == RPCCommands.SET_ACTIVITY) {
        if (args.activity && args.activity.assets) {
          args.activity.assets = {
            large_image: transport.parseImageAnyToAsset(
              // @ts-ignore
              args.activity.assets.large_image
            ),
            // @ts-ignore
            large_text: args.activity.assets.large_text,
            small_image: transport.parseImageAnyToAsset(
              // @ts-ignore
              args.activity.assets.small_image
            ),
            // @ts-ignore
            small_text: args.activity.assets.small_text
          };
        }
      }
      transport.send({ cmd, args, evt: void 0, nonce });
      transport._expecting.set(nonce, { resolve, reject });
    });
  }
  setActivity(args = {}, pid2 = pid(), ipcId = 0) {
    let timestamps;
    let assets;
    let party;
    let secrets;
    if (args.startTimestamp || args.endTimestamp) {
      timestamps = {
        start: args.startTimestamp,
        end: args.endTimestamp
      };
      if (timestamps.start instanceof Date) {
        timestamps.start = Math.round(timestamps.start.getTime());
      }
      if (timestamps.end instanceof Date) {
        timestamps.end = Math.round(timestamps.end.getTime());
      }
      if (timestamps.start > 2147483647e3) {
        throw new RangeError(
          "timestamps.start must fit into a unix timestamp"
        );
      }
      if (timestamps.end > 2147483647e3) {
        throw new RangeError(
          "timestamps.end must fit into a unix timestamp"
        );
      }
    }
    if (args.largeImageKey || args.largeImageText || args.smallImageKey || args.smallImageText) {
      assets = {
        large_image: args.largeImageKey,
        large_text: args.largeImageText,
        small_image: args.smallImageKey,
        small_text: args.smallImageText
      };
    }
    if (args.partySize || args.partyId || args.partyMax) {
      party = { id: args.partyId };
      if (!party.id) {
        party.id = uuid4122();
      }
      if (args.partySize || args.partyMax) {
        party.size = [
          args.partySize,
          args.partyMax
        ];
      }
    }
    if (args.matchSecret || args.joinSecret || args.spectateSecret) {
      secrets = {
        match: args.matchSecret,
        join: args.joinSecret,
        spectate: args.spectateSecret
      };
    }
    return this.request(ipcId, RPCCommands.SET_ACTIVITY, {
      pid: pid2,
      activity: {
        type: 0,
        // Playing
        state: args.state,
        details: args.details,
        timestamps,
        assets,
        party,
        secrets,
        buttons: args.buttons,
        instance: !!args.instance
      }
    });
  }
  clearActivity(pid2 = pid(), ipcId = 0) {
    return this.request(ipcId, RPCCommands.SET_ACTIVITY, {
      pid: pid2
    });
  }
  async destroy() {
    await Promise.all(
      Array.from(this.transports.values()).map((t) => t.close())
    );
  }
  async fetchOpenSocket() {
    const opens = [];
    for (let i = 0; i < 10; i++) {
      const trans = new ipc_default(this);
      opens.push(i);
      await trans.connect(i).catch(() => {
        opens.pop();
      });
      trans.close();
    }
    return opens;
  }
};
var client_default = RPCClient;

// src/index.ts
var src_default = client_default;
// Annotate the CommonJS export names for ESM import in node:
0 && (module.exports = {
  Client
});
//# sourceMappingURL=index.js.map