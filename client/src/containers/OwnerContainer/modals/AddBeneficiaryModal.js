import React, { useState } from 'react';
import { Button, Modal, Form } from 'semantic-ui-react';

const AddBeneficiaryModal = ({
  title,
  newBeneficiary,
  handleAddBeneficiaryChange,
  submitBtnTitle,
  onAddBeneficiary,
}) => {
  const [open, setOpen] = useState(false);

  return (
    <Modal
      onClose={() => setOpen(false)}
      onOpen={() => setOpen(true)}
      open={open}
      trigger={<Button>Add Benefiary</Button>}
    >
      <Modal.Header>{title}</Modal.Header>
      <Modal.Content>
        <Form>
          <Form.Field>
            <input
              placeholder="address"
              value={newBeneficiary.address}
              onChange={handleAddBeneficiaryChange}
              name="address"
            />
          </Form.Field>
          <Form.Field>
            <input
              placeholder="email"
              value={newBeneficiary.email}
              onChange={handleAddBeneficiaryChange}
              name="email"
            />
          </Form.Field>
          <Form.Field>
            <input
              placeholder="name"
              value={newBeneficiary.name}
              onChange={handleAddBeneficiaryChange}
              name="name"
            />
          </Form.Field>
        </Form>
      </Modal.Content>
      <Modal.Actions>
        <Button
          content={submitBtnTitle}
          labelPosition="right"
          icon="checkmark"
          onClick={(e) => {
            onAddBeneficiary(e);
            setOpen(false);
          }}
          positive
        />
      </Modal.Actions>
    </Modal>
  );
};

export default AddBeneficiaryModal;
