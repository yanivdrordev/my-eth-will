import { Table, Grid } from 'semantic-ui-react';
import AddBeneficiaryModal from '../modals/AddBeneficiaryModal';
import BeneficiariesTableRow from './BeneficiariesTableRow';

const BeneficiariesTable = ({
  beneficiariesLength,
  beneficiariesStructs,
  onUpdateBeneficiaryAmount,
  setBeneficiariesStructs,
  newBeneficiary,
  handleAddBeneficiaryChange,
  onAddBeneficiary,
  onDeleteBeneficiary
}) => {
  const renderRows = () => {
    return beneficiariesStructs.map((struct, index) => {
      return (
        <BeneficiariesTableRow
          key={index}
          index={index}
          struct={struct}
          beneficiariesStructs={beneficiariesStructs}
          setBeneficiariesStructs={setBeneficiariesStructs}
          onUpdateBeneficiaryAmount={onUpdateBeneficiaryAmount}
          onDeleteBeneficiary={onDeleteBeneficiary}
        />
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
            <Table.HeaderCell>Actions</Table.HeaderCell>
            <Table.HeaderCell>Name</Table.HeaderCell>
            <Table.HeaderCell>Email</Table.HeaderCell>
            <Table.HeaderCell>Address</Table.HeaderCell>
            <Table.HeaderCell>Verification Status</Table.HeaderCell>
            <Table.HeaderCell>Amount</Table.HeaderCell>
          </Table.Row>
        </Table.Header>

        <Table.Body>{renderRows()}</Table.Body>
      </Table>
    </>
  );
};

export default BeneficiariesTable;
