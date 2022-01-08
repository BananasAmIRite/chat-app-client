import { useContext, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import client, { ClientContext } from '../../client/client';
import { UserData } from '../../client/interfaces/interfaces';
import BaseModal, { ModalProps } from '../Modal';

export function UserModalBody(props: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  cb: (user: UserData) => void;
}) {
  const [respValue, setRespValue] = useState('');
  const [isErrorBannerShown, setErrorBannerShown] = useState(false);
  const [errorBannerContent, setErrorBannerContent] = useState('');

  const { ChatAppClient } = useContext(ClientContext);

  const showErrorBanner = (err: string) => {
    setErrorBannerContent(err);
    setErrorBannerShown(true);
  };

  const onSubmit = async () => {
    const usrName = respValue;
    setRespValue('');

    const usrData = await ChatAppClient.queryUserByUsername(usrName);

    if (usrData === undefined || typeof usrData === 'string') {
      // no user found

      showErrorBanner('Invalid user. ');

      return;
    }

    setErrorBannerShown(false);
    props.setShow(false); // OHH OK

    props.cb?.(usrData);
  };

  return (
    <div className='d-inline'>
      <Form.Control
        type='text'
        placeholder='Username'
        value={respValue}
        onChange={(e) => {
          setRespValue(e.target.value);
        }}
      />
      <Alert variant='danger' dismissible show={isErrorBannerShown} onClose={() => setErrorBannerShown(false)}>
        {errorBannerContent}
      </Alert>
      <br />
      <Button variant='primary' onClick={onSubmit}>
        Submit
      </Button>
    </div>
  );
}

export function UserModal(
  props: {
    cb?: (user: UserData) => void;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
  } & Omit<ModalProps, 'body'>
) {
  // const [show, setShow] = useState<boolean>(true); //

  return (
    <BaseModal
      body={<UserModalBody show={props.show} setShow={props.setShow} cb={props.cb} />}
      title={props.title || 'Select User'}
      show={props.show}
      className='modal-background text-white'
      closeButtonVariant='white'
      headerProps={{
        onHide: () => {
          props.setShow(false);
        },
      }}
      {...props}
    />
  );
}
