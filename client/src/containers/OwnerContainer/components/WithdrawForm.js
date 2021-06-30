import { Button, Form, Icon } from 'semantic-ui-react';

const WithdrawForm = ({ onWithdraw, withdrawEth, setWithdrawEth }) => {
  return (
    <Form onSubmit={onWithdraw}>
      <Form.Field>
        <input
          value={withdrawEth}
          onChange={(e) => setWithdrawEth(e.target.value)}
        />
      </Form.Field>
      <Button type="submit" icon>
        <Icon.Group size="large">
          <Icon name="ethereum" />
          <Icon corner name="minus" />
        </Icon.Group>
        Withdraw
      </Button>
    </Form>
  );
};

export default WithdrawForm;
