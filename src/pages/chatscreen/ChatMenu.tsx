import { useContext } from 'react';
import { Link } from 'react-router-dom';
import { ClientContext } from '../../client/client';

export default function ChatRoomSelectMenu() {
  const { client } = useContext(ClientContext);
  return (
    <div className='bg-dark overflow-auto' style={{ width: '15vw', minWidth: '15vw' }}>
      {client.userData.chatrooms.map((e) => (
        <ChatRoomSelectItem chatId={e.id} display={e.name} key={e.id}></ChatRoomSelectItem>
      ))}{' '}
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
        {props.display}
        <ChatRoomSelectSettingsItem chatId={props.chatId}></ChatRoomSelectSettingsItem>
      </button>
    </Link>
  );
}

export function ChatRoomSelectSettingsItem(props: { chatId: number }) {
  return <button style={{ float: 'right' }}></button>;
}
