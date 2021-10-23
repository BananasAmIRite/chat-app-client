import { BrowserRouter, Route, Switch } from 'react-router-dom';
import ChatRoomSelectMenu from './chatscreen/ChatMenu';
import ChatRoomMenu from './chatscreen/ChatRoomMenu';

export default function ChatScreen() {
  return (
    <div>
      <div className='d-flex align-items-stretch vh-100 vw-100'>
        <BrowserRouter>
          <ChatRoomSelectMenu />
          <div className='d-flex w-100' style={{ backgroundColor: '#36393f', color: 'white' }}>
            <Switch>
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
