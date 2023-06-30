export enum SocketConst {
  connection = "connection",
  disconnect = "disconnect",
  updateUser = "updateUser",
  clientsList = "clientsList",
  userCalled = "userCalled",
  me = "me",
  callAccepted = "callAccepted",
  streamChanged = "streamChanged",
  callDisconnected = "callDisconnected",
  callDeclined = "callDeclined",
}

export interface User {
  id: string;
  name: string;
}

export type Users = Record<string, User>;

export interface Caller {
  callerId: string;
  callerName: string;
  callerSignal: any;
}

export interface UserCalledData {
  to: string;
  signal: any;
  from: string;
  name: string;
}

export type CallControlFunc = (props?: any) => void;

export interface CallControlFunctions {
  shareScreen: CallControlFunc;
  showCamera: CallControlFunc;
  stopStreaming: CallControlFunc;
  endCall: CallControlFunc;
}
