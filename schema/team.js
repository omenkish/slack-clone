export default `
  type Team {
    id: ID!
    name: String!
    owner: User!
    members: [User!]!
    channels: [Channel!]!
  }

  type Mutation {
    createTeam(name: String!): Team!
  }
`;
