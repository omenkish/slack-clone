export default `

  type Team {
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }

  type Channel {
    id: ID!
    name: String!
    public: Boolean!
    messages: [Message!]!
    users: [User!]!
  }

  type Message {
    id: ID!
    text: String!
    user: User!
    channel: Channel!
  }

  type User {
    id: ID!
    username: String!
    email: String!
    teams: [Team!]!
  }

  type Query {
    hi: String
  }
`;
