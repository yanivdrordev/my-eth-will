import { Icon, Table, Input, Grid } from 'semantic-ui-react';
import EmailVerificationModal from '../modals/EmailVerificationModal';
import UpdateBeneficiaryAmountModal from '../modals/UpdateBeneficiaryAmountModal';
import AddBeneficiaryModal from '../modals/AddBeneficiaryModal';

const BeneficiariesTable = ({
  beneficiariesLength,
  beneficiariesStructs,
  contractAddress,
  onUpdateBeneficiaryAmount,
  setBeneficiariesStructs,
  newBeneficiary,
  handleAddBeneficiaryChange,
  onAddBeneficiary,
}) => {
  const renderRows = () => {
    return beneficiariesStructs.map((struct, index) => {
      console.log(struct);
      return (
        <Table.Row key={index}>
          <Table.Cell>{struct.name}</Table.Cell>
          <Table.Cell>{struct.email}</Table.Cell>
          <Table.Cell>{struct.beneficiarAddress}</Table.Cell>
          <Table.Cell textAlign="center">
            {struct.verifiedAddress ? (
              <Icon color="green" name="checkmark" size="large" />
            ) : (
              <EmailVerificationModal
                titleWarning="IF YOU DONT USE GMAIL copy this message and sent it manually"
                struct={struct}
                contractAddress={contractAddress}
              ></EmailVerificationModal>
            )}
          </Table.Cell>
          <Table.Cell>
            {struct.verifiedAddress ? (
              /* START UPDATE BENEFIARY AMOUNT MODAL FORM */
              <>
                <Input disabled value={struct.amount} />
                <UpdateBeneficiaryAmountModal
                  title="UPDATE BENEFICIARY AMOUNT"
                  beneficiariesStructs={beneficiariesStructs}
                  index={index}
                  setBeneficiariesStructs={setBeneficiariesStructs}
                  submitBtnTitle="UPDATE BENEFICIARY AMOUNT"
                  onUpdateBeneficiaryAmount={(e) =>
                    onUpdateBeneficiaryAmount(e, index)
                  }
                ></UpdateBeneficiaryAmountModal>
              </>
            ) : (
              /* END ADD BENEFICIARY MODAL FORM */
              <>
                <Icon name="attention" />
                need to verified benifiary address first{' '}
                <Input disabled value={struct.amount} />
              </>
            )}
          </Table.Cell>
        </Table.Row>
      );
    });
  };

  return (
    <>
      <Grid>
        <Grid.Column floated="left" width={6} verticalAlign="bottom">
          <div>beneficiaries count: {beneficiariesLength}</div>
        </Grid.Column>
        <Grid.Column floated="right" width={6} textAlign="right">
          {/* START ADD BENEFICIARY MODAL FORM */}
          <AddBeneficiaryModal
            title="ADD NEW BENEFICIARY"
            newBeneficiary={newBeneficiary}
            handleAddBeneficiaryChange={handleAddBeneficiaryChange}
            submitBtnTitle="ADD NEW BENEFICIARY"
            onAddBeneficiary={onAddBeneficiary}
          />
          {/* END ADD BENEFICIARY MODAL FORM */}
        </Grid.Column>
      </Grid>
      <Table celled>
        <Table.Header>
          <Table.Row>
            <Table.HeaderCell>name</Table.HeaderCell>
            <Table.HeaderCell>email</Table.HeaderCell>
            <Table.HeaderCell>address</Table.HeaderCell>
            <Table.HeaderCell>verification status</Table.HeaderCell>
            <Table.HeaderCell>amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{renderRows()}</Table.Body>
      </Table>
    </>
  );
};

export default BeneficiariesTable;
