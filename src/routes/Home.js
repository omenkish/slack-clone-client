/* eslint-disable implicit-arrow-linebreak */
import React from 'react';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';

const Home = ({ data: { loading, allUsers } }) =>
  (loading ? null : allUsers.map(user => (<h1 key={user.id}>{user.email}</h1>)));

const allUsersQuery = gql`
  {
    allUsers {
      id
      email
    }
  }
`;

export default graphql(allUsersQuery)(Home);
