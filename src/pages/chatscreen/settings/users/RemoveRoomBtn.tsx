import { useContext, useEffect, useState } from 'react';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ClientContext } from '../../../../client/client';

export default function RemoveRoomBtn() {
  const { ChatAppClient, client } = useContext(ClientContext);

  const { id } = useParams<{ id: string }>();
  const history = useHistory();

  const deleteRoom = () => {
    ChatAppClient.deleteRoom(parseInt(id));
    history.go(0);
  };

  const [allowedToEdit, setAllowedToEdit] = useState(false);

  const location = useLocation();

  useEffect(() => {
    ChatAppClient.getRoom(parseInt(id) || 0).then((roomData) => {
      if (!roomData) return;
      setAllowedToEdit(roomData.owner.id === client.userData.id);
    });
  }, [location]);

  return allowedToEdit ? (
    <div className='btn btn-danger' onClick={deleteRoom}>
      Delete Room
    </div>
  ) : (
    <></>
  );
}
