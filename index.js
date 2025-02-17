const express = require('express')
const mongoose = require('mongoose')
const cors = require('cors')
const bodyParser = require('body-parser')
const dotenv = require('dotenv')
dotenv.config()

const { ApolloServer } = require('apollo-server-express')
const { typeDefs } = require('./GQLComponents/GQL_Schema')
const { resolvers } = require('./GQLComponents/GQL_Resolvers')

const app = express()
app.use(bodyParser.json())
app.use('*', cors())

const connectDB = async () => {
  try {
    await mongoose.connect(process.env.Mongo_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    })
  } catch (error) {
    console.log(error)
  }
}

const startServer = async () => {
  await connectDB()
  const server = new ApolloServer({ typeDefs, resolvers })
  await server.start()
  server.applyMiddleware({ app })
  app.listen(process.env.PORT, () => {
    console.log(`Server running at http://localhost:${process.env.PORT}`)
    console.log(`GraphQL path: http://localhost:${process.env.PORT}${server.graphqlPath}`)
  })
}

startServer()
