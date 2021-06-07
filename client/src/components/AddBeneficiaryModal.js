import React, { useState } from 'react';
import { Button, Form, Header, Image, Modal } from 'semantic-ui-react';

const AddBeneficiaryModal = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Show Modal</Button>}
    >
      <Modal.Header>{props.title}</Modal.Header>
      <Modal.Content>{props.children}</Modal.Content>
      <Modal.Actions>
        <Button
          content={props.submitBtnTitle}
          labelPosition="right"
          icon="checkmark"
          onClick={(e) => {
            props.onAddBeneficiary(e);
            setOpen(false);
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AddBeneficiaryModal;
