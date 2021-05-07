import client from "../../client";

export default {
    Query: {
        searchUsers: async (_, { keyword, lastId }) => {
            try {
                const users = await client.user.findMany({
                    take: 4,
                    skip: lastId ? 1 : 0,
                    where: { username: { startsWith: keyword.toLowerCase() } },
                    ...(lastId && { cursor: { id: lastId } })
                })
                return users
            } catch (err) {
                console.log(err);
            }
        }
    }
}