import React, { Component } from 'react';
import { extendObservable } from 'mobx';
import { observer } from 'mobx-react';
import {
  Form, Button, Input, Container, Message, Header,
} from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import CustomError from '../error';

class Login extends Component {
  constructor(props) {
    super(props);

    extendObservable(this, {
      email: '',
      password: '',
      errors: {},
    });
  }

  // eslint-disable-next-line consistent-return
  onSubmit = async () => {
    const { email, password } = this;
    const { mutate, history } = this.props;

    try {
      const response = await mutate({
        variables: { email, password },
      });

      const {
        ok, token, refreshToken, errors,
      } = response.data.login;

      if (ok) {
        localStorage.setItem('token', token);
        localStorage.setItem('refreshToken', refreshToken);
        return history.push('/');
      }
      throw new CustomError(errors, 'validation failed');
    } catch (error) {
      if (error.message === 'validation failed') {
        const err = {};
        error.errorArray.forEach(({ path, message }) => {
          err[`${path}Error`] = message;
        });
        this.errors = err;
      }
    }
  }

  onChange = (e) => {
    const { name, value } = e.target;
    this[name] = value;
  }

  render() {
    const { email, password, errors: { emailError, passwordError } } = this;

    const errorList = [];

    if (emailError) errorList.push(emailError);
    if (passwordError) errorList.push(passwordError);
    return (
      <Container text>
        <Header as="h2">Login</Header>

        <Form>
          <Form.Field error={!!emailError}>
            <Input
              type="email"
              name="email"
              onChange={this.onChange}
              value={email}
              placeholder="Email"
              fluid
            />
          </Form.Field>

          <Form.Field error={!!passwordError}>
            <Input
              name="password"
              onChange={this.onChange}
              type="password"
              value={password}
              placeholder="Password"
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

const loginMutation = gql`
  mutation($email: String!, $password: String!) {
    login(email: $email, password: $password){
      ok
      token
      refreshToken
      errors {
        path
        message
      }
    }
  }
`;

export default graphql(loginMutation)(observer(Login));
