import bcrypt from "bcrypt"
import fs, { createWriteStream } from "fs"
import client from "../../client"
import { protectResolver } from "../users.utils"

export default {
    Mutation: {
        editProfile: protectResolver(
            async (_, { firstName, lastName, username, email, password: newPassword, bio, avatar }, { loggedInUser }) => {

                // Read And Save upload file
                let avatarUrl = null
                if (avatar) {
                    const { filename, createReadStream } = await avatar
                    const newFilename = `${loggedInUser.id}-${Date.now()}-${filename}`
                    const readStream = createReadStream()
                    const writeStream = createWriteStream(process.cwd() + "/uploads/" + newFilename)
                    readStream.pipe(writeStream)
                    avatarUrl = `http://localhost:4000/static/${newFilename}`
                }

                let uglyPassword = null
                if (newPassword) {
                    uglyPassword = await bcrypt.hash(newPassword, 10)
                }
                const updatedUser = await client.user.update({
                    where: { id: loggedInUser.id },
                    data: {
                        firstName,
                        lastName,
                        username,
                        email,
                        bio,
                        ...(uglyPassword && { password: uglyPassword }),
                        ...(avatarUrl && { avatar: avatarUrl })
                    }
                })
                if (updatedUser) {
                    return { ok: true }
                } else {
                    return { ok: false, error: "프로필을 업데이트 할 수 없습니다." }
                }
            })
    }
}