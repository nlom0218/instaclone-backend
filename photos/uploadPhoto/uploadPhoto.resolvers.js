import client from "../../client";
import { protectResolver } from "../../users/users.utils";

export default {
    Mutation: {
        uploadPhoto: protectResolver(
            async (_, { file, caption }, { loggedInUser }) => {
                let hashtagObjs = []
                if (caption) {
                    // parse caption
                    const hashtags = caption.match(/#[ㄱ-ㅎ|ㅏ-ㅣ|가-힣|\w]+/g)
                    hashtagObjs = hashtags.map(hashtag => ({
                        where: { hashtag }, create: { hashtag }
                    }))
                }
                // get or create Hashtags
                return client.photo.create({
                    data: {
                        file,
                        caption,
                        user: { connect: { id: loggedInUser.id } },
                        ...(hashtagObjs.length > 0 && { hashtag: { connectOrCreate: hashtagObjs } })
                    }
                })

                // save the photo With the parsed hashtags
                // add tho photo to the hashtags
            }
        )
    }
}