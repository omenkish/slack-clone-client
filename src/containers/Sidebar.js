import React from 'react';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import findIndex from 'lodash/findIndex';
import Channels from '../components/Channels';
import Teams from '../components/Teams';
import authenticate from '../utils/authentication';

const Sidebar = ({ data: { loading, allTeams }, currentTeamId }) => {
  if (loading) return null;

  const teamIndex = currentTeamId ? findIndex(allTeams, ['id', currentTeamId]) : 0;
  const team = allTeams[teamIndex];
  const authUser = authenticate();
  return [
    <Teams
      key="team-sidebar"
      teams={allTeams.map(t => ({
        id: t.id,
        letter: t.name.charAt(0).toUpperCase(),
      }))}
    />,
    <Channels
      key="channels-sidebar"
      teamName={team.name}
      username={authUser.username}
      channels={team.channels}
      users={[{ id: 1, name: 'slackbot' }, { id: 2, name: 'User1' }]}
    />,
  ];
};

const allTeamsQuery = gql`
  {
    allTeams {
      id
      name
      channels {
        id
        name
      }
    }
  }
`;

export default graphql(allTeamsQuery)(Sidebar);
