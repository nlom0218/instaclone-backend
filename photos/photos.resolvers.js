import client from "../client"

export default {
    Photo: {
        user: ({ userId }) => client.user.findUnique({ where: { id: userId } }),
        hashtags: ({ id }) => client.hashtag.findMany({ where: { photos: { some: { id } } } }),
        likes: ({ id }) => client.like.count({ where: { photoId: id } })
    },
    Hashtag: {
        totalPhotos: ({ id }) => client.photo.count({ where: { hashtags: { some: { id } } } }),
        photos: async ({ id }, { page }) => {
            return client.photo
                .findMany({
                    where:
                        { hashtags: { some: { id } } },
                    take: 5,
                    skip: (page - 1) * 5
                })
        }
    }
}