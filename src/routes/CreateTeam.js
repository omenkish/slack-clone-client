import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Form, Button, Input, Container, Message, Header,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import CustomError from '../utils/error';

class CreateTeam extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      name: '',
      errors: {},
    });
  }

  // eslint-disable-next-line consistent-return
  onSubmit = async () => {
    const { name } = this;
    const { mutate, history } = this.props;
    let response = null;
    try {
      response = await mutate({
        variables: { name },
      });
      const { ok, errors, team } = response.data.createTeam;

      if (ok) {
        return history.push(`view-team/${team.id}`);
      }
      throw new CustomError(errors, 'validation failed');
    } catch (error) {
      if (error.message === 'validation failed') {
        const err = {};
        error.errorArray.forEach(({ path, message }) => {
          err[`${path}Error`] = message;
        });
        this.errors = err;
      } else {
        history.push('/login');
      }
    }
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  render() {
    const { name, errors: { nameError } } = this;

    const errorList = [];

    if (nameError) errorList.push(nameError);
    return (
      <Container text>
        <Header as="h2">Create A Team</Header>

        <Form>
          <Form.Field error={!!nameError}>
            <Input
              name="name"
              onChange={this.onChange}
              value={name}
              placeholder="Name"
              fluid
            />
          </Form.Field>

          <Button onClick={this.onSubmit}>Submit</Button>
        </Form>

        {!!errorList.length && (
          <Message
            error
            header="There were errors with your submission"
            list={errorList}
          />
        )}
      </Container>
    );
  }
}

const createTeamMutation = gql`
  mutation($name: String!) {
    createTeam(name: $name){
      ok
      team {
        id
      }
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(createTeamMutation)(observer(CreateTeam));
