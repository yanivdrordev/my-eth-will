import React, { useState } from 'react';
import { Button, Modal, Icon } from 'semantic-ui-react';

const DeleteBeneficiaryModal = ({ title , onDeleteBeneficiary}) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={
        <Button icon labelPosition="left">
          <Icon name="delete" />
          Delete Beneficiary
        </Button>
      }
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>Are you sure?</Modal.Content>
      <Modal.Actions>
        <Button color="black" onClick={() => setOpen(false)}>
          Nope
        </Button>
        <Button
          content="Yep, that's me"
          labelPosition="right"
          icon="checkmark"
          onClick={(e) => {onDeleteBeneficiary(e);setOpen(false)}}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default DeleteBeneficiaryModal;
