import client from "../client"

export default {
    Room: {
        users: ({ id }) => client.room.findUnique({ where: { id } }).users(),
        messages: ({ id }) => client.message.findMany({ where: { roomId: id } }),
        unreadTotal: async ({ id }, _, { loggedInUser }) => {
            if (!loggedInUser) {
                return 0
            }
            return client.message.count({
                where: {
                    read: false,
                    roomId: id,
                    userId: { not: loggedInUser.id }
                }
            })
        }
    },
    Message: {
        user: ({ id }) => client.user.findFirst({ where: { messages: { some: { id } } } })
    }
}