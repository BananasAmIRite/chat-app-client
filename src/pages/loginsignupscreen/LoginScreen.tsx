import { FormEvent, useContext, useState } from 'react';
import { Alert, Form } from 'react-bootstrap';
import { useHistory } from 'react-router';
import { ClientContext } from '../../client/client';

export default function LoginScreen() {
  const { ChatAppClient } = useContext(ClientContext);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [err, setError] = useState('');

  const history = useHistory();

  const submitForm = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const d = await ChatAppClient.requestLogin(username, password, false);
    setUsername('');
    setPassword('');

    if (typeof d !== 'string') {
      // reload and return

      history.go(0);
      return;
    }
    setError(d || '');
  };

  return (
    <form onSubmit={submitForm} className='d-flex flex-column'>
      <h1>Sign In</h1>
      <br />
      <Form.Control placeholder='Username' type='text' value={username} onChange={(e) => setUsername(e.target.value)} />
      <br />
      <Form.Control
        placeholder='Password'
        type='password'
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      <br />
      <Alert variant='danger' dismissible show={err !== ''} onClose={() => setError('')}>
        {err}
      </Alert>
      <br />
      <br />
      <Form.Control className='btn btn-primary' type='submit' />

      <a href='/register'>Register</a>
    </form>
  );
}
