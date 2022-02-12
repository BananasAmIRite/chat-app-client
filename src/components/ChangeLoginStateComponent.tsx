import { useContext } from 'react';
import { ClientContext } from '../client/client';
import { LoginState } from '../client/interfaces/interfaces';

export default function ChangeLoginStateComponent() {
  const { client, setClient, ChatAppClient } = useContext(ClientContext);

  return (
    <button
      onClick={() => {
        ChatAppClient.attemptLogin(setClient);
        setClient({
          login:
            client.login === LoginState.NOT_LOGGED_IN
              ? LoginState.LOGGED_IN
              : client.login === LoginState.LOGGED_IN
              ? LoginState.UNAUTHENTICATED
              : LoginState.NOT_LOGGED_IN,
        });
      }}
    >
      Change State
    </button>
  );
}
