import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        toggleLike: protectResolver(async (_, { id }, { loggedInUser }) => {
            try {
                const photo = await client.photo.findUnique({ where: { id } })
                if (!photo) {
                    return {
                        ok: false,
                        error: "사진을 찾을 수 없습니다."
                    }
                }
                const likeWhere = { photoId_userId: { photoId: id, userId: loggedInUser.id } }
                const like = await client.like.findUnique({ where: likeWhere })
                if (like) {
                    await client.like.delete({ where: likeWhere })
                } else {
                    await client.like.create({
                        data: {
                            user: { connect: { id: loggedInUser.id } },
                            photo: { connect: { id } }
                        }
                    })
                }
                return {
                    ok: true
                }
            } catch (err) {
                console.log(err);
            }
        })
    }
}