import { useContext, useState } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { ClientContext } from '../client/client';
import ChatRoomSelectMenu from './chatscreen/ChatMenu';
import ChatRoomMenu from './chatscreen/ChatRoomMenu';
import ChatRoomSettingsMenu from './chatscreen/settings/ChatRoomSettingsMenu';

export default function ChatScreen() {
  const { ChatAppClient } = useContext(ClientContext);

  const [isWsClosed, setWsClosed] = useState(false);

  ChatAppClient.setCloseListener(() => setWsClosed(true));

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
          <div className='d-flex w-100' style={{ backgroundColor: '#36393f', color: 'white' }}>
            <Switch>
              <Route path='/room/:id/settings'>
                <ChatRoomSettingsMenu />
              </Route>
              <Route path='/room/:id'>
                <ChatRoomMenu />
              </Route>
            </Switch>
          </div>
        </BrowserRouter>
      </div>
    </div>
  );
}
