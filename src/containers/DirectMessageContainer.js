/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Comment } from 'semantic-ui-react';
import Messages from '../components/Messages';

// const newChannelMessageSubscription = gql`
//   subscription($channelId: ID!) {
//     newChannelMessage(channelId: $channelId) {
//       id
//       text
//       createdAt
//       user {
//         username
//       }
//     }
//   }
// `;

// eslint-disable-next-line react/prefer-stateless-function
class DirectMessageContainer extends Component {
  // state = {
  //   channelId: null,
  //   unsubscribe: null,
  // };

  // static getDerivedStateFromProps(nextProps, prevState) {
  //   if (!nextProps.data.loading) {
  //     // Check for existing subscription
  //     if (prevState.unsubscribe) {
  //       // Only unsubscribe/update state if subscription variable has changed
  //       if (prevState.channelId === nextProps.channelId) {
  //         return null;
  //       }
  //       prevState.unsubscribe();
  //     }

  //     return {
  //       // Subscribe
  //       unsubscribe: nextProps.data.subscribeToMore({
  //         document: newChannelMessageSubscription,
  //         variables: {
  //           channelId: nextProps.channelId,
  //         },
  //         updateQuery: (previousResult, { subscriptionData }) => {
  //           // Perform updates on previousResult with subscriptionData
  //           if (!subscriptionData) return previousResult;

  //           return {
  //             ...previousResult,
  //             messages: [...previousResult.messages,
  //               subscriptionData.data.newChannelMessage],
  //           };
  //         },
  //       }),
  //       // Store channelId in state for next update
  //       channelId: nextProps.channelId,
  //     };
  //   }

  //   return null;
  // }
  render() {
    const { data } = this.props;

    console.log('data :', data);
    return (data.loading ? null : (
      <Messages>
        <Comment.Group>
          { !!data.directMessages && data.directMessages.map(m => (
            <Comment key={`${m.id}-direct-message`}>
              <Comment.Content>
                <Comment.Author as="a">{m.sender.username}</Comment.Author>
                <Comment.Metadata>
                  <div>{m.createdAt}</div>
                </Comment.Metadata>
                <Comment.Text>{m.text}</Comment.Text>
                <Comment.Actions>
                  <Comment.Action>Reply</Comment.Action>
                </Comment.Actions>
              </Comment.Content>
            </Comment>
          ))}
        </Comment.Group>
      </Messages>
    ));
  }
}

const directMessagesQuery = gql`
  query($teamId: ID!, $userId: ID!){
    directMessages(teamId: $teamId, otherId: $userId){
      id
      text
      createdAt
      sender {
        username
      }
    }
  }
`;

export default graphql(directMessagesQuery, {
  variables: props => ({
    teamId: props.teamId,
    otherId: props.userId,
  }),
  options: {
    fetchPolicy: 'network-only',
  },
})(DirectMessageContainer);
