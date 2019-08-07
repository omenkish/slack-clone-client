import { gql } from 'apollo-boost';

// eslint-disable-next-line import/prefer-default-export
export const meQuery = gql`
  {
    me {
      id
      username
      teams {
        id
        name
        admin
        channels {
          id
          name
        }
      }
    }
  }
`;
