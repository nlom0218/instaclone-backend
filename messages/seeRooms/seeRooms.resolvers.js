import client from "../../client"
import { protectResolver } from "../../users/users.utils"

export default {
    Query: {
        seeRooms: protectResolver(async (_, __, { loggedInUser }) => {
            return client.room.findMany({
                where: { users: { some: { id: loggedInUser.id } } }
            })
        })
    }
}