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

// FT is intermediate value, must NEVER be altered
export interface Response<T, S = boolean> {
  success: S;
  code: S extends true ? 200 : number;
  response: S extends true ? T : S extends false ? string : T | string;
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

export type ChatroomUser = Omit<UserData, 'chatrooms'>;

export enum EventTypes {
  MESSAGE = 'message',
  USER_ADD = 'roomuseradd',
  USER_REMOVE = 'roomuserremove',
  ROOM_ADD = 'roomcreate',
  ROOM_REMOVE = 'roomremove', // event type pretty much
}

export interface LoginResponse {
  token: string;
}

export interface ErrorResponse {
  error: string;
  code: number;
}

export interface RegisterResponse {
  successful: true;
}
