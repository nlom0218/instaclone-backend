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
                const newComment = await client.comment.create({
                    data: {
                        payload,
                        photo: { connect: { id: photoId } },
                        user: { connect: { id: loggedInUser.id } }
                    }
                })
                console.log(newComment);
                return {
                    ok: true,
                    id: newComment.id
                }
            } catch (err) {
                console.log(err);
            }
        })
    }
}