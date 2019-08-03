import { gql } from 'apollo-boost';

// eslint-disable-next-line import/prefer-default-export
export const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      owner 
      channels {
        id
        name
      }
    }
    inviteTeams {
      id
      name
      owner
      channels {
        id
        name
      }
    }
  }
`;
