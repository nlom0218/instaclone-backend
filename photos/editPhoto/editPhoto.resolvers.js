import client from "../../client";
import { protectResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
    Mutation: {
        editPhoto: protectResolver(async (_, { id, caption }, { loggedInUser }) => {
            console.log(loggedInUser);
            try {
                const oldPhoto = await client.photo.findFirst({
                    where: { id, userId: loggedInUser.id },
                    include: { hashtags: { select: { hashtag: true } } }
                })
                if (!oldPhoto) {
                    return {
                        ok: false,
                        error: "사진 수정 권한이 없습니다."
                    }
                }
                await client.photo.update({
                    where: { id },
                    data: {
                        caption,
                        hashtags: {
                            disconnect: oldPhoto.hashtags,
                            connectOrCreate: processHashtags(caption)
                        }
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