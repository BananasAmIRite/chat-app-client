export default function Message(props: { message: string; user: string }) {
  return (
    <div className='message w-100'>
      <b>
        <u>{props.user}</u>
      </b>
      : <br></br>
      {props.message}
    </div>
  );
}
