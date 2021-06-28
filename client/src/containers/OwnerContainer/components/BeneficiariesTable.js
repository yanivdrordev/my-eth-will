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
