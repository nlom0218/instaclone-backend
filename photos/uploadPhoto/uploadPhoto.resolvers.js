import client from "../../client";
import { uploadToS3 } from "../../shared/shared.utils";
import { protectResolver } from "../../users/users.utils";
import { processHashtags } from "../photos.utils";

export default {
    Mutation: {
        uploadPhoto: protectResolver(
            async (_, { file, caption }, { loggedInUser }) => {
                let hashtagObjs = []
                if (caption) {
                    // parse caption
                    hashtagObjs = processHashtags(caption)
                }
                const fileUrl = await uploadToS3(file, loggedInUser.id, "uploads")
                // get or create Hashtags
                return client.photo.create({
                    data: {
                        file: fileUrl,
                        caption,
                        user: { connect: { id: loggedInUser.id } },
                        ...(hashtagObjs.length > 0 && { hashtags: { connectOrCreate: hashtagObjs } })
                    }
                })

                // save the photo With the parsed hashtags
                // add tho photo to the hashtags
            }
        )
    }
}