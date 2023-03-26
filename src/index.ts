import { createServer } from "http";
import express from "express";
import { ApolloServer, gql } from "apollo-server-express";
const { prisma } = require('./prisma/client');


const startServer = async () => {

  const app = express()
  const httpServer = createServer(app)

  const typeDefs = gql`
    type Query {
    users: [User]
  }

  type User {
    id: ID!
    name: String!
    last_login: DateTime
    created_at: DateTime
  }
  `;

  const resolvers = {
    Query: {
      users: () => {
        return prisma.user.findMany()
      }
    },
  };

  const apolloServer = new ApolloServer({
    typeDefs,
    resolvers,
  })

  await apolloServer.start()

  apolloServer.applyMiddleware({
      app,
      path: '/api'
  })

  httpServer.listen({ port: process.env.PORT || 4000 }, () =>
    console.log(`Server listening on localhost:4000${apolloServer.graphqlPath}`)
  )
}

startServer()
