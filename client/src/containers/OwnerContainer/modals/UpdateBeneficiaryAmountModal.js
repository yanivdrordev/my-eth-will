import React, { useState } from 'react';
import { Button, Modal } from 'semantic-ui-react';

const UpdateBeneficiaryAmountModal = (props) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Update Amount</Button>}
    >
      <Modal.Header>{props.title}</Modal.Header>
      <Modal.Content>{props.children}</Modal.Content>
      <Modal.Actions>
        <Button
          content={props.submitBtnTitle}
          labelPosition="right"
          icon="checkmark"
          onClick={(e) => {
            props.onUpdateBeneficiaryAmount(e);
            setOpen(false);
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default UpdateBeneficiaryAmountModal;
