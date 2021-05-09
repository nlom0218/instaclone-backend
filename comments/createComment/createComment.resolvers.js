import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        createComment: protectResolver(async (_, { photoId, payload }, { loggedInUser }) => {
            try {
                const ok = await client.photo.findUnique({ where: { id: photoId }, select: { id: true } })
                if (!ok) {
                    return {
                        ok: false,
                        error: "사진을 찾을 수 없습니다."
                    }
                }
                await client.comment.create({
                    data: {
                        payload,
                        photo: { connect: { id: photoId } },
                        user: { connect: { id: loggedInUser.id } }
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