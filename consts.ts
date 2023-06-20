export enum SocketConst {
  connection = "connection",
  disconnect = "disconnect",
  updateUser = "updateUser",
  clientsList = "clientsList",
  userCalled = "userCalled",
  me = "me",
  callAccepted = "callAccepted",
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
  userToCall: string;
  signalData: any;
  from: string;
  name: string;
}
