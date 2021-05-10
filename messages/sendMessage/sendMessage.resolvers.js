import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        sendMessage: protectResolver(async (_, { payload, roomId, userId }, { loggedInUser }) => {
            try {
                let room = null
                if (userId) {
                    const user = await client.user.findUnique({ where: { id: userId }, select: { id: true } })
                    if (!user) {
                        return {
                            ok: false,
                            error: "사용자를 찾을 수 없습니다."
                        }
                    }
                    room = await client.room.create({
                        data: {
                            users: { connect: [{ id: userId }, { id: loggedInUser.id }] }
                        }
                    })
                } else if (roomId) {
                    room = await client.room.findUnique({
                        where: { id: roomId },
                        select: { id: true }
                    })
                    if (!room) {
                        return {
                            ok: false,
                            error: "채팅을 찾을 수 없습니다."
                        }
                    }
                }
                const newMessage = await client.message.create({
                    data: {
                        payload,
                        user: { connect: { id: loggedInUser.id } },
                        room: { connect: { id: room.id } }
                    }
                })
                return {
                    ok: true
                }
            } catch (err) {
                console.log(err);
            }

        })
    }
}