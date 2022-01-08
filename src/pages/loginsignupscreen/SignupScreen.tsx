import { FormEvent, useContext, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { CheckLg, XLg } from 'react-bootstrap-icons';
import { useHistory } from 'react-router';
import { ClientContext } from '../../client/client';

export default function SignupScreen() {
  const { ChatAppClient } = useContext(ClientContext);
  const [username, setUsername] = useState('');
  const [pw, setPw] = useState('');
  const [confPw, setConfPw] = useState('');
  const [err, setError] = useState('');

  const history = useHistory();

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (pw !== confPw) return;

    const res = await ChatAppClient.register(username, pw);

    setUsername('');
    setPw('');
    setConfPw('');

    if (typeof res === 'string') {
      setError(res);
      return;
    }

    history.push('/');
  };

  return (
    <form onSubmit={submitForm}>
      <h1>Register</h1>
      <br />
      <Form.Control placeholder='Username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <Form.Control placeholder='Password' type='password' value={pw} onChange={(e) => setPw(e.target.value)} />
      <br />
      <div>
        <Form.Control
          placeholder='Confirm Password'
          type='password'
          value={confPw}
          onChange={(e) => setConfPw(e.target.value)}
          className='d-inline'
          style={{ width: '90%' }}
        />
        {pw === confPw && pw !== '' ? <CheckLg className='d-inline m-1' /> : <XLg className='d-inline m-1' />}
        <br />
      </div>
      <br />
      <Alert variant='danger' dismissible show={err !== ''} onClose={() => setError('')}>
        {err}
      </Alert>
      <br />
      <br />
      <Form.Control className='btn btn-primary' type='submit' disabled={pw !== confPw} />

      <a href='/login'>Log in</a>
    </form>
  );
}
