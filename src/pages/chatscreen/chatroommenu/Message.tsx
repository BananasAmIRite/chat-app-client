import { useState } from 'react';
import { createDate, createTime } from '../../../utils/Date';

function MessageUser(props: { username: string }) {
  const [underlined, setUnderlined] = useState(false);

  return (
    <b
      onMouseEnter={() => setUnderlined(true)}
      onMouseLeave={() => setUnderlined(false)}
      style={{ textDecoration: underlined ? 'underline' : 'none', cursor: 'pointer' }}
    >
      {props.username}
    </b>
  );
}

export function MessageWithoutUser(props: { message: string; time?: Date }) {
  const [hover, setHover] = useState(false);

  return (
    <div
      className='message w-100'
      style={{ paddingTop: 0 }}
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <span className='message-time'>{props.time && hover ? createTime(props.time.getTime()) : ''}</span>
      {props.message}
    </div>
  );
}

export default function Message(props: { message: string; user: string; time?: Date }) {
  const [hover, setHover] = useState(false);
  return (
    <div className='message w-100' onMouseEnter={() => setHover(true)} onMouseLeave={() => setHover(false)}>
      <MessageUser username={props.user} />
      <span className='message-date'>{createDate(props.time.toUTCString())}</span>
      <br></br>
      <span className='message-time'>{props.time && hover ? createTime(props.time.getTime()) : ''}</span>
      {props.message}
    </div>
  );
}
