import { useContext, useEffect, useRef, useState } from 'react';
import Message from './chatroommenu/Message';
import { Message as MessageData } from '../../client/interfaces/interfaces';
import { useLocation, useParams } from 'react-router-dom';
import { ClientContext } from '../../client/client';
import ChatInput from './chatroommenu/ChatInput';

export default function ChatRoomMenu() {
  // note to self: update this to complex classes
  const { ChatAppClient } = useContext(ClientContext);
  const [messages, setMessages] = useState<MessageData[]>([]);

  const { id } = useParams<{ id: string }>();

  const location = useLocation();

  const r = useRef(null);

  useEffect(() => {
    // runs on location, i.e. route change
    ChatAppClient.getMessages(0, 50, parseInt(id) || 0).then((e) => setMessages(e));

    (r.current as any).scrollTop = (r.current as any).getBoundingClientRect().height;
  }, [location]);

  useEffect(() => {
    ChatAppClient.setMessageHandler<MessageData>((data) => {
      setMessages([JSON.parse(data.data as unknown as string).payload, ...messages]);
    });
  }, [messages]);

  return (
    <div className='d-flex flex-column-reverse w-100'>
      {
        // weird dumb hacky way of doing it idk what else i can do
      }
      <ChatInput />
      <div className='w-100 bg-secondary d-flex flex-column-reverse overflow-auto vh-100' ref={r}>
        {messages.map((e) => (
          <Message message={e.content} user={e.user.username} key={e.id} />
        ))}
      </div>
    </div>
  );
}
