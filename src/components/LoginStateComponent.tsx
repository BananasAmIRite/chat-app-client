import { useContext, useEffect } from 'react';
import { BrowserRouter } from 'react-router-dom';
import { ClientContext } from '../client/client';
import { LoginState } from '../client/interfaces/interfaces';
import ChatScreen from '../pages/ChatScreen';
import LoginSignupScreen from '../pages/LoginSignupScreen';

export default function LoginStateComponent() {
  const { client, setClient, ChatAppClient } = useContext(ClientContext);

  useEffect(() => {
    console.log(ChatAppClient);

    ChatAppClient.attemptLogin(setClient).then((e) => {
      console.log(e);
    });
    // setTimeout(() => {
    //   console.log(client.login);
    // }, 5000);
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
