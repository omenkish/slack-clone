export default `
  type DirectMessage {
    id: ID!
    text: String!
    sender: User!
    receiverId: ID!
    createdAt: String!
  }

  type Query {
    directMessages(teamId: ID!, otherId: ID!): [DirectMessage!]!
  }
  type Mutation {
    createDirectMessage(receiverId: ID!, text: String!, teamId: ID!): Boolean!
  }
`;
