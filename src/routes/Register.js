import React, { Component } from 'react';
import { Button, Input, Message, Container, Header } from 'semantic-ui-react';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import CustomError from '../error';

class Register extends Component {

  state = {
    username: '',
    usernameError: '',
    email: '',
    emailError: '',
    password: '',
    passwordError: '',
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({ [name]: value });
  }

  onSubmit = async () => {
    this.setState({
      usernameError: '',
      emailError: '',
      passwordError: '',
    });
    try {
      const { username, email, password } = this.state;
      const response = await this.props.mutate({
        variables: { username, email, password },
      });

      const { ok, errors } = response.data.register;

      if (ok) {
        return this.props.history.push('/');
      } 
      throw new CustomError(errors);  
    } catch (error) {
      const err = {};
      error.errorArray.forEach(({ path, message }) => {
        err[`${path}Error`] = message;
      });
      return this.setState(err);
    }
  }
  render() {

    const {
      username,
      email,
      password,
      usernameError,
      emailError,
      passwordError
    } = this.state;

    const errorList = [];

    if (usernameError) errorList.push(usernameError);
    if (emailError) errorList.push(emailError);
    if (passwordError) errorList.push(passwordError);
    return (
      <Container text>
        <Header as="h2">Register</Header>
        <Input
          error={!!usernameError}
          name="username"
          onChange={this.onChange}
          value={username}
          placeholder="Username"
          fluid 
        />
        <Input
          error={!!emailError}
          name="email"
          onChange={this.onChange}
          value={email}
          placeholder="Email"
          fluid 
        />
        <Input
          error={!!passwordError}
          name="password"
          onChange={this.onChange}
          type="password"
          value={password}
          placeholder="Password"
          fluid 
        />
        <Button onClick={this.onSubmit}>Submit</Button>
        {(usernameError || emailError || passwordError) && (
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

const registerMutation = gql `
  mutation($username: String!, $email: String!, $password: String!){
    register(username: $username, email: $email, password: $password){
      ok
      errors {
        path
        message
      }
    }
  }
`;
export default graphql(registerMutation)(Register);
