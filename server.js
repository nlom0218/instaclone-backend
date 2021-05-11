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
    context: async (ctx) => {
        if (ctx.req) {
            return {
                loggedInUser: await getUser(ctx.req.headers.token)
            }
        } else {
            const { connection: { context } } = ctx
            return {
                loggedInUser: context.loggedInUser
            }
        }
    },
    subscriptions: {
        // onConnect에서의 return 값은 context로 향하게 된다.
        onConnect: async ({ token }) => {
            if (!token) {
                throw new Error("You can't listen.")
            }
            const loggedInUser = await getUser(token)
            return { loggedInUser }
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
