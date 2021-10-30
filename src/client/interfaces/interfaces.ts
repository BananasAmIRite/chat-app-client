export enum LoginState {
  NOT_LOGGED_IN, // no login attempts yet
  LOGGED_IN, // successful login attempt
  UNAUTHENTICATED, // yes login attempt, unsuccessful
}

export interface UserData {
  id: number;
  username: string;
  chatrooms?: ChatRoom[];
}

export interface ChatRoom {
  id: number;
  name: string;
  owner: UserData;
}

export interface Response<T> {
  success: boolean;
  code: number;
  response: T;
}

export interface WebsocketResponse<T = any> {
  type: string;
  payload: T;
}

export interface ClientState {
  login: LoginState;
  userData: UserData;
}

export interface Message {
  id: number;
  chatRoom: ChatRoom;
  content: string;
  user: UserData;
  createdAt: string;
}
