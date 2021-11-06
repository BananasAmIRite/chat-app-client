import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ClientContext } from '../../client/client';
import whiteImage from '../../white_circle.png';

export default function ChatRoomSelectMenu() {
  const { client } = useContext(ClientContext);
  return (
    <div className='bg-dark overflow-auto' style={{ width: '15vw', minWidth: '15vw' }}>
      {client.userData.chatrooms.map((e) => (
        <ChatRoomSelectItem chatId={e.id} display={e.name} key={e.id}></ChatRoomSelectItem>
      ))}
      {
        // change to:
        // <ChatRoomSelectItem chatId={1} display={'something'}></ChatRoomSelectItem>
      }
    </div>
  );
}

export function ChatRoomSelectItem(props: { chatId: number; display: string }) {
  return (
    <Link to={`/room/${props.chatId}`}>
      <button className='btn btn-dark mt-2' style={{ width: '90%' }}>
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
      <input
        style={{ float: 'right', width: '10%', filter: 'invert(50%)' }}
        type='image'
        src={whiteImage}
        alt='Settings'
      />
    </Link>
  );
}
