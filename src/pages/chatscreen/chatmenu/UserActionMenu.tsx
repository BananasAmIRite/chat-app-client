import { MouseEventHandler, useContext } from 'react';
import { useHistory } from 'react-router';
import { ClientContext } from '../../../client/client';

export default function UserActionMenu() {
  const { client, ChatAppClient } = useContext(ClientContext);

  const history = useHistory();

  const signOut: MouseEventHandler<HTMLButtonElement> = async () => {
    ChatAppClient.signOut();
    history.go(0);
  };

  return (
    <div
      className='pt-2 ps-2 pe-2 w-100 d-flex align-items-center flex-row justify-content-center'
      style={{ height: '75px' }}
    >
      <div className='h-100 d-flex p-1' style={{ width: '50%' }}>
        <h6 className='align-self-center text-truncate'>{client.userData.username}</h6>
      </div>

      <button className='btn btn-primary' onClick={signOut}>
        Sign out
      </button>
    </div>
  );
}
