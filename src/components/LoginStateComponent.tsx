import { useContext, useEffect } from 'react';
import { ClientContext } from '../client/client';
import { LoginState } from '../client/interfaces/interfaces';
import ChatScreen from '../pages/ChatScreen';
import LoginSignupScreen from '../pages/LoginSignupScreen';

export default function LoginStateComponent() {
  const { client, ChatAppClient } = useContext(ClientContext);

  useEffect(() => {
    ChatAppClient.attemptLogin();
  }, []);

  return (
    <div>
      {
        client.login === LoginState.LOGGED_IN ? <ChatScreen></ChatScreen> : <LoginSignupScreen></LoginSignupScreen>
        // client.login === LoginState.NOT_LOGGED_IN ? (
        //   'NOT LOGGED IN'
        // ) : (
        //   'UNAUTHENTICATED'
        // )}
      }
    </div>
  );
}
