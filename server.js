const apolloServer = require('apollo-server');
const dataLoaderSequelize = require('dataloader-sequelize');

const db = require('./models');

const { ApolloServer, gql } = apolloServer;
const { createContext, EXPECTED_OPTIONS_KEY } = dataLoaderSequelize;

// GraphQL schema
const typeDefs = gql`
  type User {
    id: ID!
    name: String
    emails: [Email!]!
  }

  type Email {
    id: ID!
    address: String
    user: User!
  }

  type Query {
    users: [User!]!
    user(id: ID!): User
  }
`;

// GraphQL <-> ORM
const resolvers = {
  User: {
    emails: (parent, args, context, info) => parent.getEmails(),
  },
  Email: {
    user: (parent, args, context, info) => parent.getUser(),
  },
  Query: {
    users: (parent, args, { db, eok }, info) =>
      db.user.findAll({ [EXPECTED_OPTIONS_KEY]: eok }),
    user: (parent, { id }, { db, eok }, info) =>
      db.user.findById(id, { [EXPECTED_OPTIONS_KEY]: eok }),
  },
};

// Apollo server
const server = new ApolloServer({
  typeDefs,
  resolvers,
  context: {
    db: db,
    eok: createContext(db.sequelize),
  },
});

// Entry point
async function start() {
  await db.sequelize.sync({ force: true });

  // Setup dummy
  const userA = await db.user.create({ name: 'A' });
  const userB = await db.user.create({ name: 'B' });
  await userA.createEmail({ address: 'A1@e-mail.com' });
  await userA.createEmail({ address: 'A2@e-mail.com' });
  await userB.createEmail({ address: 'B1@e-mail.com' });

  server.listen().then(({ url }) => {
    console.log(`🚀 Server ready at ${url}`);
  });
}

start();
