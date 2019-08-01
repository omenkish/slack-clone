export default `
  type Channel {
    id: ID!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
  }

  type ChannelResponse {
    ok: Boolean!
    channel: Channel
    errors: [Error!]
  }
  type Mutation {
     createChannel(teamId: ID!, name: String!): ChannelResponse!
  }
`;
