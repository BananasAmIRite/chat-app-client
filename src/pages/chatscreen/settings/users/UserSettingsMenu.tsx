import { useContext, useEffect, useState } from 'react';
import { useLocation, useParams } from 'react-router-dom';
import { ClientContext } from '../../../../client/client';
import { ChatroomUser, EventTypes } from '../../../../client/interfaces/interfaces';
import { UserModal } from '../../../../components/modals/UserModal';

export default function UserSettingsMenu() {
  const { ChatAppClient, client } = useContext(ClientContext);
  const { id } = useParams<{ id: string }>();

  const [users, setUsers] = useState<ChatroomUser[]>([]);

  const [allowedToEdit, setAllowedToEdit] = useState(false);

  const [showAddDialog, setAddDialog] = useState<boolean>(false);

  const location = useLocation();

  useEffect(() => {
    ChatAppClient.getUsers(parseInt(id) || 0).then((usrs) => {
      if (!usrs) return;

      setUsers(usrs);
    });

    ChatAppClient.getRoom(parseInt(id) || 0).then((roomData) => {
      if (!roomData) return;
      setAllowedToEdit(roomData.owner.id === client.userData.id);
    });
  }, [location]);

  ChatAppClient.addMessageHandler<ChatroomUser[]>('users', (data) => {
    if (data.type !== EventTypes.USER_REMOVE && data.type !== EventTypes.USER_ADD) return;
    setUsers(data.payload);
  });

  return (
    <div id='user-settings-menu-container'>
      {showAddDialog ? ( //
        <UserModal
          title='Add User'
          size='lg'
          cb={(userData) => {
            ChatAppClient.addUser(parseInt(id) || 0, userData.id);
          }}
          show={showAddDialog}
          setShow={setAddDialog}
        />
      ) : (
        <> </>
      )}
      <div id='user-settings-menu-list'>
        {users.length > 0
          ? users.map((e, i) => {
              return (
                <UserSettingsMenuItem
                  {...e}
                  key={i}
                  onRemove={
                    allowedToEdit
                      ? (uId) => {
                          ChatAppClient.removeUser(parseInt(id) || 0, uId);
                        }
                      : undefined
                  }
                ></UserSettingsMenuItem>
              );
            })
          : 'No users'}
      </div>
      <br />
      <div id='user-settings-menu-controls'>
        {allowedToEdit ? (
          <button className='btn btn-success' onClick={() => setAddDialog(true)}>
            Add User
          </button>
        ) : (
          <> </>
        )}
      </div>
    </div>
  );
}

export function UserSettingsMenuItem<T extends ChatroomUser & { onRemove?: (id: number) => void }>(props: T) {
  const [hover, setHover] = useState(false);
  const { client } = useContext(ClientContext);

  return (
    <div className='room-user' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      {props.username}
      {props.onRemove && props.id !== client.userData.id ? (
        <button
          className={`btn btn-danger float-end m-auto ${hover ? 'd-auto' : 'd-none'}`}
          onClick={() => props.onRemove(props.id)}
        >
          Remove
        </button>
      ) : (
        <> </>
      )}
    </div>
  );
}
