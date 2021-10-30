import { useContext, useState } from 'react';
import { useParams } from 'react-router-dom';
import { ClientContext } from '../../../client/client';

export default function ChatInput() {
  const [inputState, setInputState] = useState('');

  const { ChatAppClient } = useContext(ClientContext);

  const { id } = useParams<{ id: string }>();

  const submit: React.FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();
    if (!inputState) return;

    ChatAppClient.sendMessage(parseInt(id) || 0, inputState);

    setInputState('');
  };

  return (
    <form onSubmit={submit}>
      <input
        className='w-100 d-flex form-control border-0 shadow-none'
        style={{
          height: '5%',
          minHeight: '40px',
          backgroundColor: '#636773',
          color: '#fff',
        }}
        placeholder='Type here to chat'
        value={inputState}
        onInput={(e) => setInputState(e.currentTarget.value)}
      />
    </form>
  );
}
