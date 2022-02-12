import { useContext, useEffect, useState } from 'react';
import { BrowserRouter, Redirect, Route, Switch, useHistory } from 'react-router-dom';
import { ClientContext } from '../client/client';
import { EventTypes, UserData } from '../client/interfaces/interfaces';
import ChatRoomSelectMenu from './chatscreen/ChatMenu';
import ChatRoomMenu from './chatscreen/ChatRoomMenu';
import ChatRoomSettingsPage from './chatscreen/settings/ChatRoomSettingsMenu';

export default function ChatScreen() {
  const { ChatAppClient, client } = useContext(ClientContext);

  const [isWsClosed, setWsClosed] = useState(false);

  ChatAppClient.setCloseListener(() => setWsClosed(true));

  const history = useHistory();

  useEffect(() => {
    ChatAppClient.addMessageHandler<UserData[]>('chatroommenu', (data) => {
      if (data.type !== EventTypes.USER_REMOVE) return;
      console.log('chatroommenu is currently handling event');

      const users = data.payload.map((e) => e.id);
      if (!users.includes(client.userData.id)) {
        window.location.reload();
      }
    });

    return () => {
      ChatAppClient.removeMessageHandler('chatroommenu');
    };
  }, []);

  return (
    <div className='d-flex flex-column mh-100 vh-100 vw-100'>
      {isWsClosed ? (
        <div className='alert alert-warning m-0' role='alert'>
          Disconnected. Please refresh.
        </div>
      ) : (
        <> </>
      )}
      <div className='d-flex align-items-stretch flex-grow-1'>
        <BrowserRouter>
          <ChatRoomSelectMenu />
          <div className='d-flex w-100 flex-grow-1' style={{ backgroundColor: '#36393f', color: 'white' }}>
            <Switch>
              <Route path='/room/:id/settings'>
                <ChatRoomSettingsPage />
              </Route>
              <Route path='/room/:id'>
                <ChatRoomMenu />
              </Route>
              <Route path='/'>
                <Redirect to='/'></Redirect>
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}
