import { useContext, useEffect, useState } from 'react';
import { GearFill } from 'react-bootstrap-icons';
import { Link } from 'react-router-dom';
import { ClientContext } from '../../client/client';
import { EventTypes, UserData } from '../../client/interfaces/interfaces';
import CreateRoomBtn from './chatmenu/CreateRoomBtn';
import UserActionMenu from './chatmenu/UserActionMenu';

export default function ChatRoomSelectMenu() {
  const { client, ChatAppClient } = useContext(ClientContext);

  const [hover, setHover] = useState<boolean>(false);

  const mouseEnter = () => {
    setHover(true);
  };
  const mouseLeave = () => {
    setHover(false);
  };

  useEffect(() => {
    ChatAppClient.addMessageHandler<UserData[]>('chatmenu', (data) => {
      if (
        data.type !== EventTypes.USER_REMOVE &&
        data.type !== EventTypes.USER_ADD &&
        data.type !== EventTypes.ROOM_ADD &&
        data.type !== EventTypes.ROOM_REMOVE
      )
        return;
      // const users = data.payload.map((e) => e.id);
      // if (!users.includes(client.userData.id)) {
      // ddos? never heard of that before.
      ChatAppClient.reloadUserData();
      // }

      return () => {
        ChatAppClient.removeMessageHandler('chatmenu');
      };
    });
  }, []);

  return (
    <div className='bg-dark text-white' style={{ minWidth: '200px', width: '15vw' }}>
      <div
        style={{ height: 'calc(100vh - 75px)', position: 'relative' }}
        onMouseEnter={mouseEnter}
        onMouseLeave={mouseLeave}
      >
        <div style={{ position: 'relative', height: '100%' }}>
          {client.userData.chatrooms.map((e) => (
            <ChatRoomSelectItem chatId={e.id} display={e.name} key={e.id}></ChatRoomSelectItem>
          ))}
        </div>

        <CreateRoomBtn
          className={'create-room-btn'}
          style={{ position: 'absolute', bottom: '20px', right: '20px' }}
          data-hover={`${hover}`}
        />
      </div>
      <UserActionMenu />
    </div>
  );
}

export function ChatRoomSelectItem(props: { chatId: number; display: string }) {
  return (
    <Link to={`/room/${props.chatId}`}>
      <button className='btn btn-dark mt-2 text-truncate' style={{ width: '90%' }}>
        <ChatRoomSelectSettingsItem chatId={props.chatId}></ChatRoomSelectSettingsItem>
        <br />
        {props.display}
      </button>
    </Link>
  );
}

export function ChatRoomSelectSettingsItem(props: { chatId: number }) {
  return (
    <Link to={`/room/${props.chatId}/settings`}>
      <GearFill style={{ float: 'right', width: '10%', filter: 'invert(50%)' }} />
    </Link>
  );
}
