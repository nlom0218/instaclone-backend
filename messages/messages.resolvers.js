import client from "../client"

export default {
    Room: {
        users: ({ id }) => {
            return client.room.findUnique({ where: { id } }).users()
        },
        messages: ({ id }) => {
            return client.message.findMany({ where: { roomId: id } })
        }
    }
}