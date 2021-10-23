import { createContext, Dispatch, SetStateAction, useState } from 'react';
import AxiosInstance from '../AxiosInstance';
import { config } from 'dotenv';
import { ClientState, LoginState, UserData, Response, Message, WebsocketResponse } from './interfaces/interfaces';

config({
  path: __dirname + '/.env',
});
console.log(`${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}`);

export interface IClientContext {
  client: Partial<ClientState>;
  setClient: Dispatch<Partial<SetStateAction<ClientState>>>;
  ChatAppClient: ChatAppClient;
}

export default class ChatAppClient {
  private _server: string;
  private _ws: WebSocket;
  constructor(
    private _client?: Partial<ClientState>,
    private _setClient?: Dispatch<Partial<SetStateAction<ClientState>>>
  ) {
    this._server = `${process.env.REACT_APP_SERVER_IP}:${process.env.REACT_APP_SERVER_PORT}`;
    this.setupWebsocket();
  }

  get server() {
    return this._server;
  }

  async setupWebsocket() {
    this._ws = new WebSocket(`ws://${this._server}/api/user/events`);
  }

  async setMessageHandler<T = any>(e: (data: MessageEvent<WebsocketResponse<T>>) => void) {
    this._ws.onmessage = e;
  }

  async attemptLogin(options?: { token: string }): Promise<UserData | undefined> {
    let data: Response<UserData>;
    try {
      data = await (await AxiosInstance.get<Response<UserData>>(`http://${this._server}/api/user/me`)).data;
      if (!data) throw new Error(); // so itll all flow back into the catch statement
    } catch (err) {
      console.log(err);

      this._setClient({
        login: LoginState.UNAUTHENTICATED,
        userData: undefined,
      });
      return;
    }

    this._setClient({
      login: LoginState.LOGGED_IN,
      userData: data.response,
    });

    return data.response;
  }

  async getMessages(offset: number, amount: number, roomId: number): Promise<Message[]> {
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
    return data.response;
  }

  async sendMessage(roomId: number, message: string): Promise<void> {
    // localhost:{{port}}/api/chatroom/{{room}}/messages/send?&message=e6
    try {
      await AxiosInstance.post(
        `http://${this._server}/api/chatroom/${roomId.toString()}/messages/send?message=${message}`
      );
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

export const ClientProvider = (props: any) => {
  const [client, setClient] = useState({
    login: LoginState.NOT_LOGGED_IN,
    userData: undefined,
  });

  const cac = new ChatAppClient(client, setClient);
  return (
    <ClientContext.Provider value={{ client, setClient, ChatAppClient: cac }}>{props.children}</ClientContext.Provider>
  );
};
