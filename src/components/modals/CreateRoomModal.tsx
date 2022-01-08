import { useContext, useState } from 'react';
import { Alert, Button, Form } from 'react-bootstrap';
import client, { ClientContext } from '../../client/client';
import { UserData } from '../../client/interfaces/interfaces';
import BaseModal, { ModalProps } from '../Modal';

export function CreateRoomModalBody(props: {
  show: boolean;
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
  cb: (name: string) => void;
}) {
  const [respValue, setRespValue] = useState('');
  const [isErrorBannerShown, setErrorBannerShown] = useState(false);
  const [errorBannerContent, setErrorBannerContent] = useState('');

  const showErrorBanner = (err: string) => {
    setErrorBannerContent(err);
    setErrorBannerShown(true);
  };

  const onSubmit = async () => {
    const rmName = respValue;

    if (rmName === '') {
      showErrorBanner('Invalid room name. ');
      return;
    }
    setRespValue('');

    setErrorBannerShown(false);
    props.setShow(false); // OHH OK

    props?.cb(rmName);
  };

  return (
    <div className='d-inline'>
      <Form.Control
        type='text'
        placeholder='Room Name'
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
        Create
      </Button>
    </div>
  );
}

export function CreateRoomModal(
  props: {
    cb?: (user: string) => void;
    show: boolean;
    setShow: React.Dispatch<React.SetStateAction<boolean>>;
  } & Omit<ModalProps, 'body'>
) {
  // const [show, setShow] = useState<boolean>(true); //

  return (
    <BaseModal
      body={<CreateRoomModalBody show={props.show} setShow={props.setShow} cb={props.cb} />}
      title={props.title || 'Create Room'}
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
