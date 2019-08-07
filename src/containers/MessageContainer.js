/* eslint-disable class-methods-use-this */
import React, { Component } from 'react';
import { graphql } from 'react-apollo';
import { gql } from 'apollo-boost';
import { Comment } from 'semantic-ui-react';
import Messages from '../components/Messages';

const newChannelMessageSubscription = gql`
  subscription($channelId: ID!) {
    newChannelMessage(channelId: $channelId) {
      id
      text
      createdAt
      user {
        username
      }
    }
  }
`;

class MessageContainer extends Component {
  state = {
    channelId: null,
    unsubscribe: null,
  };

  static getDerivedStateFromProps(nextProps, prevState) {
    if (!nextProps.data.loading) {
      // Check for existing subscription
      if (prevState.unsubscribe) {
        // Only unsubscribe/update state if subscription variable has changed
        if (prevState.channelId === nextProps.channelId) {
          return null;
        }
        prevState.unsubscribe();
      }

      return {
        // Subscribe
        unsubscribe: nextProps.data.subscribeToMore({
          document: newChannelMessageSubscription,
          variables: {
            channelId: nextProps.channelId,
          },
          updateQuery: (previousResult, { subscriptionData }) => {
            // Perform updates on previousResult with subscriptionData
            if (!subscriptionData) return previousResult;

            return {
              ...previousResult,
              messages: [...previousResult.messages,
                subscriptionData.data.newChannelMessage],
            };
          },
        }),
        // Store channelId in state for next update
        channelId: nextProps.channelId,
      };
    }

    return null;
  }

  // componentDidMount() {
  //   this.unsubscribe = this.subscribe();
  // }

  // componentWillReceiveProps({ channelId: newChannelId }) {
  //   const { channelId } = this.props;
  //   if (channelId !== newChannelId) {
  //     if (this.unsubscribe) {
  //       this.unsubscribe();
  //     }
  //     this.unsubscribe = this.subscribe();
  //   }
  // }

  // componentWillUnmount() {
  //   if (this.unsubscribe) {
  //     this.unsubscribe();
  //   }
  // }

  // subscribe = () => {
  //   const { data, channelId } = this.props;
  //   return data.subscribeToMore({
  //     document: newChannelMessageSubscription,
  //     variables: {
  //       channelId,
  //     },
  //     updateQuery: (previousResult, { subscriptionData }) => {
  //       // Perform updates on previousResult with subscriptionData
  //       if (!subscriptionData) return previousResult;

  //       return {
  //         ...previousResult,
  //         messages: [...previousResult.messages,
  //           subscriptionData.data.newChannelMessage],
  //       };
  //     },
  //   });
  // }

  render() {
    const { data: { loading, messages } } = this.props;
    return (loading ? null : (
      <Messages>
        <Comment.Group>
          { !!messages && messages.map(m => (
            <Comment key={`${m.id}-message`}>
              <Comment.Content>
                <Comment.Author as="a">{m.user.username}</Comment.Author>
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


const messagesQuery = gql`
  query($channelId: ID!) {
    messages(channelId: $channelId) {
      id
      text
      createdAt
      user {
        username
      }
    }
  }
`;
export default graphql(messagesQuery, {
  variables: props => ({
    channelId: props.channelId,
  }),
  options: {
    fetchPolicy: 'network-only',
  },
})(MessageContainer);
