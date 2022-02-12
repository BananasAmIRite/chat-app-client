import { createContext, Dispatch, SetStateAction, useContext, useState } from 'react';
import AxiosInstance from '../AxiosInstance';
import { config } from 'dotenv';
import {
  ClientState,
  LoginState,
  UserData,
  Response,
  Message,
  WebsocketResponse,
  ChatroomUser,
  ChatRoom,
  LoginResponse,
  RegisterResponse,
} from './interfaces/interfaces';

config({
  path: __dirname + '/.env',
});

export interface IClientContext {
  client: Partial<ClientState>;
  setClient: Dispatch<Partial<SetStateAction<ClientState>>>;
  ChatAppClient: ChatAppClient;
}

export default class ChatAppClient {
  // useFetch()!!!!!!!
  private _server: string;
  private _ws: WebSocket;
  private _messageHandlers: Map<string, (data: WebsocketResponse<any>) => void>;
  private _connCloseListener: () => void;
  constructor(
    private _client?: Partial<ClientState>,
    private _setClient?: Dispatch<Partial<SetStateAction<ClientState>>>
  ) {
    this._server = `${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}`;
    this._messageHandlers = new Map();

    this.setupWebsocket();

    // setInterval(() => {
    //   console.log('id: ' + this._id + ', ' + this._messageHandlers);
    // }, 1000);
  }

  get server() {
    return this._server;
  }

  async setupWebsocket() {
    this._ws = new WebSocket(`ws://${this._server}/api/user/events`);

    this._ws.onmessage = (data) => {
      const parsed = JSON.parse(data.data as string); // ow

      for (const e of this._messageHandlers.values()) {
        e(parsed);
      }
    };

    this._ws.onclose = () => this._connCloseListener?.();
  }

  async setCloseListener(e: () => void) {
    this._connCloseListener = e;
  }

  addMessageHandler<T = any>(id: string, e: (data: WebsocketResponse<T>) => void) {
    // this._ws.onmessage = e;
    // this is called a LOT as well
    // the client opens a websocket connection with the server

    this._messageHandlers.set(id, e);
  }

  removeMessageHandler(id: string): boolean {
    return this._messageHandlers.delete(id);
  }

  async createRoom(name: string): Promise<boolean> {
    try {
      await AxiosInstance.post(`http://${this._server}/api/chatroom/create?name=${name}`);
      return true;
    } catch (err) {
      return false;
    }
  }

  async deleteRoom(roomId: number) {
    try {
      await AxiosInstance.post(`http://${this._server}/api/chatroom/${roomId}/delete`);
      return true;
    } catch (err) {
      return false;
    }
  }

  async signOut(): Promise<void> {
    await AxiosInstance.post(`http://${this._server}/api/oauth2/user/revoke`);
  }

  async register(user: string, pw: string, hashed: boolean = false): Promise<RegisterResponse | string> {
    try {
      const data = await AxiosInstance.post<Response<RegisterResponse>>(
        `http://${this._server}/api/signup?user=${user}&password=${pw}&hashed=${hashed}`
      );
      return data.data.response;
    } catch (err) {
      return err?.response?.data?.error;
    }
  }

  async requestLogin(user: string, pw: string, hashed: boolean = false): Promise<LoginResponse | string> {
    let data: Response<LoginResponse>;
    try {
      data = (
        await AxiosInstance.get<Response<LoginResponse>>(
          `http://${this._server}/api/oauth2/auth?user=${user}&hashed=${hashed}&password=${pw}`
        )
      ).data;
    } catch (err) {
      // TODO: return the actual data.error
      return err?.response?.data?.error;
    }

    return data?.response;
  }

  async attemptLogin(setClient?, options?: { token: string }): Promise<UserData | false> {
    const data = await this.requestUserData();

    if (!data) {
      setClient({
        login: LoginState.UNAUTHENTICATED,
        userData: undefined,
      });
      return false;
    }

    setClient({
      login: LoginState.LOGGED_IN,
      userData: data,
    });

    if (data && typeof data !== 'string') return data;
  }

  async reloadUserData(setClient?): Promise<UserData | false> {
    // alias for attemptLogin
    return this.attemptLogin(setClient);
  }

  async requestUserData(): Promise<UserData | false> {
    try {
      const data = (await AxiosInstance.get<Response<UserData, true>>(`http://${this._server}/api/user/me`)).data;
      if (!data) throw new Error(); // so itll all flow back into the catch statement

      return data.response;
    } catch (err) {
      console.log(err);

      return false;
    }
  }

  async getRoom(roomId: number): Promise<ChatRoom | undefined> {
    let data: Response<ChatRoom>;

    try {
      data = await (
        await AxiosInstance.get<Response<ChatRoom>>(`http://${this._server}/api/chatroom/${roomId.toString()}`)
      ).data;
    } catch (err) {
      console.log(err);
      return;
    }

    if (data && typeof data?.response !== 'string') return data?.response;
  }

  async getMessages(offset: number, amount: number, roomId: number): Promise<Message[] | string> {
    let data: Response<Message[]>;
    try {
      data = await (
        await AxiosInstance.get<Response<Message[]>>(
          `http://${this._server}/api/chatroom/${roomId.toString()}/messages?limit=${amount}&skip=${offset}`
        )
      ).data;
      if (!data) throw new Error(); // so itll all flow back into the catch statement
    } catch (err) {
      console.log(err);
      return [];
    }
    return data?.response;
  }

  async sendMessage(roomId: number, message: string): Promise<void> {
    // localhost:{{port}}/api/chatroom/{{room}}/messages/send?&message=e6
    try {
      await AxiosInstance.post(`http://${this._server}/api/chatroom/${roomId.toString()}/messages/send`, {
        message,
      });
      // if (!res) throw new Error(); // so itll all flow back into the catch statement
    } catch (err) {
      console.log(err);
    }
  }

  async getUsers(roomId: number): Promise<ChatroomUser[] | undefined> {
    // localhost:{{port}}/api/chatroom/{{room}}/messages/send?&message=e6
    let data: Response<ChatroomUser[]>;
    try {
      data = await (
        await AxiosInstance.get<Response<ChatroomUser[]>>(
          `http://${this._server}/api/chatroom/${roomId.toString()}/users`
        )
      ).data;
      // if (!res) throw new Error(); // so itll all flow back into the catch statement
    } catch (err) {
      console.log(err);
    }

    if (data && typeof data?.response !== 'string') return data?.response;
  }

  async addUser(roomId: number, userId: number): Promise<void> {
    // localhost:{{port}}/api/chatroom/{{room}}/messages/send?&message=e6
    try {
      await AxiosInstance.post(`http://${this._server}/api/chatroom/${roomId.toString()}/users/add?userId=${userId}`);
      // if (!res) throw new Error(); // so itll all flow back into the catch statement
    } catch (err) {
      console.log(err);
    }
  }

  async removeUser(roomId: number, userId: number): Promise<void> {
    try {
      await AxiosInstance.post(
        `http://${this._server}/api/chatroom/${roomId.toString()}/users/remove?userId=${userId}`
      );
      // if (!res) throw new Error(); // so itll all flow back into the catch statement
    } catch (err) {
      console.log(err);
    }
  }

  async queryUserByUsername(userName: string): Promise<UserData | string> {
    try {
      const data = await (
        await AxiosInstance.get<Response<UserData>>(`http://${this._server}/api/user/getuser/byName/${userName}`)
      ).data;
      return data.response;
      // if (!res) throw new Error(); // so itll all flow back into the catch statement
    } catch (err) {
      console.log(err);
    }
  }

  async queryUserById(id: string): Promise<UserData | string> {
    try {
      const data = await (
        await AxiosInstance.get<Response<UserData>>(`http://${this._server}/api/user/getuser/byId/${id}`)
      ).data;
      return data.response;
      // if (!res) throw new Error(); // so itll all flow back into the catch statement
    } catch (err) {
      console.log(err);
    }
  }
}

export const ClientContext = createContext<IClientContext>({
  client: {},
  setClient: () => null,
  ChatAppClient: null,
});

let currentChatAppClient = null;

export const ClientProvider = (props: any) => {
  // kinda bad cuz i have to import this in every file by using useContext(ClientContext)
  const [client, setClient] = useState({
    login: LoginState.NOT_LOGGED_IN,
    userData: undefined,
  });

  // const client = {
  //   login: LoginState.NOT_LOGGED_IN,
  //   userData: undefined,
  // };
  // const setClient = (d) => {
  //   console.log('setting...');
  //   console.log(d);

  //   for (const k in d) {
  //     client[k] = d[k];
  //   }
  // };

  const cac = currentChatAppClient === null ? new ChatAppClient(client, setClient) : currentChatAppClient;

  currentChatAppClient = cac;
  return (
    <ClientContext.Provider value={{ client, setClient, ChatAppClient: cac }}>{props.children}</ClientContext.Provider>
  );
};
