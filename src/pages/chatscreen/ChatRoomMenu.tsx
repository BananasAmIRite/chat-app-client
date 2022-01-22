import { useContext, useEffect, useRef, useState } from 'react';
import Message, { MessageWithoutUser } from './chatroommenu/Message';
import { EventTypes, Message as MessageData, UserData } from '../../client/interfaces/interfaces';
import { useHistory, useLocation, useParams } from 'react-router-dom';
import { ClientContext } from '../../client/client';
import ChatInput from './chatroommenu/ChatInput';

export default function ChatRoomMenu() {
  // note to self: update this to complex classes
  const { ChatAppClient, client } = useContext(ClientContext);
  const [messages, setMessages] = useState<MessageData[]>([]);

  const [isLoadingData, setLoadingData] = useState(false);

  const [messageOffset, setMessageOffset] = useState(0);

  const { id } = useParams<{ id: string }>();

  const history = useHistory();

  const location = useLocation();

  const [lastLocation, setLastLocation] = useState('');

  const r = useRef(null);

  // const addMsgHandler = () => {
  //   ChatAppClient.addMessageHandler<MessageData>('messages', (data) => {
  //     if (data.type !== EventTypes.MESSAGE) return;
  //     setMessages([data.payload, ...messages]);
  //     setMessageOffset(messageOffset + 1);
  //   }); // i have to
  // };

  // useEffect(() => {
  //   addMsgHandler();
  // }, [messages]);

  // useEffect(() => {
  //   // oh ok
  //   return () => {};
  // }, [messages]);

  useEffect(() => {
    ChatAppClient.addMessageHandler<MessageData>('messages', (data) => {
      if (data.type !== EventTypes.MESSAGE) return;
      setMessages((messages) => [data.payload, ...messages]);
      setMessageOffset((messageOffset) => messageOffset + 1);
    });

    ChatAppClient.addMessageHandler<UserData[]>('chatroommenu', (data) => {
      if (data.type !== EventTypes.USER_REMOVE) return;
      const users = data.payload.map((e) => e.id);
      if (!users.includes(client.userData.id)) {
        history.push('/');
      }
    });

    return () => {
      ChatAppClient.removeMessageHandler('messages');
      ChatAppClient.removeMessageHandler('chatroommenu');
    };
  }, []);

  const loadMoreData = () => {
    if (isLoadingData) return;
    setLoadingData(true);

    ChatAppClient.getMessages(messageOffset, 25, parseInt(id) || 0).then((e) => {
      if (typeof e !== 'string') {
        setMessages([...messages, ...e]);
        setMessageOffset(messageOffset + e.length);
        setLoadingData(false);
      }
    });
  };

  const onScroll = (e) => {
    if (Math.abs(e.currentTarget.scrollHeight - (e.currentTarget.clientHeight - e.currentTarget.scrollTop)) < 10)
      loadMoreData();
  };

  // console.log('newest offset:' + messageOffset);

  useEffect(() => {
    // runs on location, i.e. route change

    const loadMessages = async (
      lastMessages: string[] = undefined,
      _messages: MessageData[] = [],
      _tempOffset: number = messageOffset
    ) => {
      let e;

      if (
        lastMessages !== undefined &&
        (lastMessages.length === 0 || r.current.scrollHeight > r.current.clientHeight)
      ) {
        setMessageOffset(_tempOffset);

        return;
      }

      // lastMessage isnt undefined and (either no more messages to load or enough messages have been loaded for a scroll bar to appear)
      e = await ChatAppClient.getMessages(_tempOffset, 25, parseInt(id) || 0);

      if (typeof e !== 'string') {
        setMessages([...messages, ..._messages]);

        await loadMessages(e, [...e, ..._messages], _tempOffset + e.length);
      }
    };

    if (location.pathname === lastLocation) return;
    setLastLocation(location.pathname);

    loadMessages();

    (r.current as any).scrollTop = (r.current as any).getBoundingClientRect().height;
  }, [location]);

  return (
    <div className='d-flex flex-column-reverse w-100' style={{ maxWidth: '95vw', maxHeight: '100vh' }}>
      {
        // weird dumb hacky way of doing it idk what else i can do
      }
      <ChatInput />
      <div className='w-100 d-flex flex-column-reverse overflow-auto flex-grow-1' ref={r} onScroll={onScroll}>
        {/* <Message message={'abcde'} user='BananasAmIRite' time={new Date()} /> */}
        {messages
          .sort((a, b) => b.id - a.id)
          .map((e, i) => {
            if (
              messages[i + 1] &&
              messages[i + 1].user.id === e.user.id &&
              new Date(e.createdAt).getTime() - new Date(messages[i + 1].createdAt).getTime() < 5 * 60 * 1000 // within 5 mins
            ) {
              return <MessageWithoutUser message={e.content} key={e.id} time={new Date(e.createdAt)} />;
            }

            return <Message message={e.content} user={e.user.username} key={e.id} time={new Date(e.createdAt)} />;
          })}
        {isLoadingData ? <span style={{ alignSelf: 'center' }}>Loading...</span> : <></>}
      </div>
    </div>
  );
}
