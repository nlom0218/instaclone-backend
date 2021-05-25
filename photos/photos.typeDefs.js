import { gql } from "apollo-server"

export default gql`
    type Photo {
        id: Int!
        user: User!
        file: String!
        caption: String
        likes: Int!
        commentNumber: Int!
        comments: [Comment]
        hashtags: [Hashtag]
        isMine: Boolean!
        isLiked: Boolean!
        createdAt: String!
        updatedAt: String!
    }
    type Hashtag {
        id: Int!
        hashtag: String!
        photos(page: Int!): [Photo]
        totalPhotos: Int!
        createdAt: String!
        updatedAt: String!
    }
    type Like {
        id: Int!
        photo: Photo!
        createdAt: String!
        updatedAt: String!
    }
`