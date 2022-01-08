import React, { useRef, useState } from 'react';
import { CloseButton, ModalProps as BootstrapModalProps } from 'react-bootstrap';
import { ModalHeaderProps } from 'react-bootstrap/ModalHeader';
import Modal from 'react-bootstrap/Modal';
import { CloseButtonVariant } from 'react-bootstrap/esm/CloseButton';

export interface ModalProps extends BootstrapModalProps {
  show?: boolean;
  title?: string;
  body?: React.ReactElement;
  footer?: React.ReactElement;
  closeButton?: boolean;
  headerProps?: ModalHeaderProps;
  closeButtonVariant?: CloseButtonVariant;
  [key: string]: any;
}

export default function BaseModal(props: ModalProps) {
  //   return <div className={`modal-dialog modal-fullscreen-${props.size}-down`}></div>;

  const [show, setShow] = useState<boolean>(props.show !== undefined ? props.show : true);

  return (
    <Modal show={show} {...props}>
      <Modal.Header {...props.headerProps}>
        <Modal.Title>{props.title}</Modal.Title>
        {props.headerProps?.closeButton || true ? (
          <CloseButton
            variant={props.closeButtonVariant}
            onClick={props.headerProps?.onHide || (() => setShow(false))}
          />
        ) : (
          <></>
        )}
      </Modal.Header>
      <Modal.Body>{props.body}</Modal.Body>
      <Modal.Footer>{props.footer}</Modal.Footer>
    </Modal>
  );
}
