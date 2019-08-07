import React from 'react';
import findIndex from 'lodash/findIndex';
import {
  Modal, Button, Input, Form,
} from 'semantic-ui-react';
import { withFormik } from 'formik';
import { compose, graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { meQuery } from '../graphql/team';

const AddChannelModal = ({
  open,
  close,
  values,
  isSubmitting,
  handleChange,
  handleBlur,
  handleSubmit,
}) => (
  <Modal
    open={open}
    onClose={close}
    closeIcon
  >
    <Modal.Header>Add Chanel</Modal.Header>
    <Modal.Content>
      <Form>
        <Form.Field>
          <Input
            value={values.name}
            name="name"
            onChange={handleChange}
            onBlur={handleBlur}
            fluid
            placeholder="Channel Name"
          />
        </Form.Field>

        <Form.Group widths="equal">
          <Button fluid onClick={close} disabled={isSubmitting} type="button"> Cancel</Button>
          <Button fluid onClick={handleSubmit} disabled={isSubmitting} type="button"> Create Channel</Button>
        </Form.Group>
      </Form>
    </Modal.Content>
  </Modal>
);

const createChannelMutation = gql`
  mutation($teamId: ID!, $name: String!) {
    createChannel(teamId: $teamId, name: $name) {
      ok
      channel {
        id
        name
      }
    }
  }
`;
export default compose(
  graphql(createChannelMutation),
  withFormik({
    mapPropsToValues: () => ({ name: '' }),

    handleSubmit: async (values, { props: { teamId, mutate, close }, setSubmitting }) => {
      await mutate({
        variables: { teamId, name: values.name },
        optimisticResponse: {
          createChannel: {
            __typename: 'Mutation',
            ok: true,
            channel: {
              __typename: 'Channel',
              id: 'aqw235t-56gnnrggtnhk5h6h6-1dd',
              name: values.name,
            },
          },
        },
        update: (store, { data: { createChannel } }) => {
          const { ok, channel } = createChannel;
          if (!ok) return;
          // Read the data from our cache for this query
          const data = store.readQuery({ query: meQuery });
          const teamIdx = findIndex(data.me.teams, ['id', teamId]);
          // Add our comment from the mutation to the end
          data.me.teams[teamIdx].channels.push(channel);
          // Write our data back to the cache
          store.writeQuery({ query: meQuery, data });
        },
      });
      close();
      setSubmitting(false);
    },
  }),
)(AddChannelModal);
