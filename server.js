require("dotenv").config()

import http from "http"
import express from "express"
import logger from "morgan"
import { ApolloServer } from 'apollo-server-express'
import { typeDefs, resolvers } from "./schema"
import { getUser } from "./users/users.utils"

const PORT = process.env.PORT

const apolloServer = new ApolloServer({
    resolvers,
    typeDefs,
    context: async ({ req }) => {
        if (req) {
            return {
                loggedInUser: await getUser(req.headers.token)
            }
        }
    }
})

const app = express()
app.use(logger("tiny"))
app.use("/static", express.static("uploads"))

apolloServer.applyMiddleware({ app })

const httpServer = http.createServer(app)
apolloServer.installSubscriptionHandlers(httpServer)

httpServer.listen(PORT, () => console.log(`🚀  Server ready at http://localhost:${PORT}`))
