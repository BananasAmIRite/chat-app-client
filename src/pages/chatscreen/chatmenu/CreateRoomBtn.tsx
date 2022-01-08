import { useContext, useState } from 'react';
import { PlusLg } from 'react-bootstrap-icons';
import { ClientContext } from '../../../client/client';
import { CreateRoomModal } from '../../../components/modals/CreateRoomModal';

export default function CreateRoomBtn(props: { className?: string; style?: { [key: string]: string } }) {
  const { ChatAppClient } = useContext(ClientContext);
  const [showCreateDialog, setCreateDialog] = useState<boolean>(false);

  return (
    <>
      <button
        {...props}
        className={`btn btn-primary btn-circle btn-lg ${props.className || ''}`}
        style={{ ...props.style, boxShadow: '0 3px 6px rgba(0, 0, 0, 0.16), 0 3px 6px rgba(0, 0, 0, 0.23)' }}
        onClick={() => setCreateDialog(true)}
      >
        <PlusLg />
      </button>
      <CreateRoomModal
        size='lg'
        cb={(roomName) => {
          ChatAppClient.createRoom(roomName);
        }}
        show={showCreateDialog}
        setShow={setCreateDialog}
      />
    </>
  );
}
