import client from "../../client";

export default {
    Query: {
        seeFollowing: async (_, { username, lastId }) => {
            try {
                const ok = await client.user.findUnique({ where: { username }, select: { id: true } })
                if (!ok) {
                    return {
                        ok: false,
                        error: "유저가 존재하지 않습니다."
                    }
                }
                const following = await client.user
                    .findUnique({ where: { username } })
                    .following({
                        take: 5,
                        skip: lastId ? 1 : 0,
                        ...(lastId && { cursor: { id: lastId } })
                    })
                return {
                    ok: true,
                    following
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
}