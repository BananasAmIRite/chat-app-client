import React, { useContext } from 'react';
import { ClientContext } from '../../../client/client';
import { UserModal } from '../../../components/modals/UserModal';
import RemoveRoomBtn from './users/RemoveRoomBtn';
import UserSettingsMenu from './users/UserSettingsMenu';

export default function ChatRoomSettingsPage() {
  // note to self: update this to complex classes
  const { ChatAppClient } = useContext(ClientContext);

  return (
    <div className='d-flex flex-column w-100' style={{ maxWidth: '85vw' }}>
      <UserSettingsMenu />
      <RemoveRoomBtn />
    </div>
  );
}

export function ChatRoomSettingsMenu(props: { elems: [string, ChatRoomSettingsItem][] }) {
  return (
    <div>
      {props.elems.map((e) => {
        return (
          <>
            <h2>{e[0]}</h2>
            {e[1]}
          </>
        );
      })}
    </div>
  );
}

export class ChatRoomSettingsItem extends React.Component<{}, {}> {
  constructor(props) {
    super(props);
    this.state = {};
  }
}
