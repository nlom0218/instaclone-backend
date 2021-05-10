import { gql } from "apollo-server"

export default gql`
    type Message {
        id: Int!
        payload: String!
        user: User!
        room: Room!
        createdAt: String!
        updatedAt: String!
    }
    type Room {
        in: Int!
        users: [User]
        messages: [Message]
        createdAt: String!
        updatedAt: String!
    }
`