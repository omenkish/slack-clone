export default `
  type DirectMessage {
    id: ID!
    text: String!
    sender: User!
    receiverId: ID!
    createdAt: String!
  }

  type Subscription {
    newDirectMessage(teamId: ID!, userId: ID!): DirectMessage!
  }
  type Query {
    directMessages(teamId: ID!, otherId: ID!): [DirectMessage!]!
  }
  type Mutation {
    createDirectMessage(receiverId: ID!, text: String!, teamId: ID!): Boolean!
  }
`;
