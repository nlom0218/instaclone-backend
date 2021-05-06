import client from "../../client"

export default {
    Query: {
        seeFollowers: async (_, { username, page }) => {
            try {
                const ok = await client.user.findUnique({ where: { username }, select: { id: true } })
                console.log(ok);
                if (!ok) {
                    return {
                        ok: false,
                        error: "유저가 존재하지 않습니다."
                    }
                }
                const followers = await client.user
                    .findUnique({ where: { username } })
                    .followers({ take: 5, skip: (page - 1) * 5 })
                const totalFollowers = await client.user.count({
                    where: { following: { some: { username } } }
                })
                return {
                    ok: true,
                    followers,
                    totalPages: Math.ceil(totalFollowers / 5)
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
}