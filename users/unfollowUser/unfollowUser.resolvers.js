import client from "../../client"
import { protectResolver } from "../users.utils"

export default {
    Mutation: {
        unfollowUser: protectResolver(async (_, { username }, { loggedInUser }) => {
            try {
                const ok = await client.user.findUnique({ where: { username } })
                if (!ok) {
                    return {
                        ok: false,
                        error: "사용자를 찾을 수 없습니다."
                    }
                }
                await client.user.update({
                    where: { id: loggedInUser.id },
                    data: { following: { disconnect: { username } } }
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