import React, { useState } from 'react';
import { Button, Form, Header, Image, Message, Modal } from 'semantic-ui-react';

const EmailVerificationModal = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>send email</Button>}
    >
      <Modal.Header>
        <Message warning header={props.titleWarning} />
      </Modal.Header>
      <Modal.Content>{props.children}</Modal.Content>
    </Modal>
  );
};

export default EmailVerificationModal;
