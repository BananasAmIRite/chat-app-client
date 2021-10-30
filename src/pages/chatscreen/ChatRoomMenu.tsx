import { useContext, useEffect, useRef, useState } from 'react';
import Message, { MessageWithoutUser } from './chatroommenu/Message';
import { Message as MessageData } from '../../client/interfaces/interfaces';
import { useLocation, useParams } from 'react-router-dom';
import { ClientContext } from '../../client/client';
import ChatInput from './chatroommenu/ChatInput';

export default function ChatRoomMenu() {
  // note to self: update this to complex classes
  const { ChatAppClient } = useContext(ClientContext);
  const [messages, setMessages] = useState<MessageData[]>([]);

  const [messageOffset, setMessageOffset] = useState(0);

  const { id } = useParams<{ id: string }>();

  const location = useLocation();

  const r = useRef(null);

  useEffect(() => {
    // runs on location, i.e. route change
    ChatAppClient.getMessages(messageOffset, 100, parseInt(id) || 0).then((e) => setMessages(e)); // when did i write this

    (r.current as any).scrollTop = (r.current as any).getBoundingClientRect().height;
  }, [location]);

  useEffect(() => {
    ChatAppClient.setMessageHandler<MessageData>((data) => {
      setMessages([JSON.parse(data.data as unknown as string).payload, ...messages]);
      setMessageOffset(messageOffset + 1);
    });
  }, [messages]);

  const loadMoreData = () => {
    ChatAppClient.getMessages(messageOffset, 100, parseInt(id) || 0).then((e) => {
      setMessages([...messages, ...e]);
      setMessageOffset(messageOffset + e.length);
    });
  };

  return (
    <div className='d-flex flex-column-reverse w-100' style={{ maxWidth: '85vw' }}>
      {
        // weird dumb hacky way of doing it idk what else i can do
      }
      <ChatInput />
      <div
        className='w-100 bg-secondary d-flex flex-column-reverse overflow-auto vh-100'
        ref={r}
        onScroll={(e) => {
          console.log(e.currentTarget.scrollHeight);
        }}
      >
        {/* <Message message={'abcde'} user='BananasAmIRite' time={new Date()} /> */}
        {messages.map((e, i) => {
          if (
            messages[i + 1] &&
            messages[i + 1].user.id === e.user.id &&
            new Date(e.createdAt).getTime() - new Date(messages[i + 1].createdAt).getTime() < 5 * 60 * 1000 // within 5 mins
          ) {
            return <MessageWithoutUser message={e.content} key={e.id} time={new Date(e.createdAt)} />;
          }

          return <Message message={e.content} user={e.user.username} key={e.id} time={new Date(e.createdAt)} />;
        })}
      </div>
    </div>
  );
}
