import bcrypt from "bcrypt"
import fs, { createWriteStream } from "fs"
import client from "../../client"
import { protectResolver } from "../users.utils"

export default {
    Mutation: {
        editProfile: protectResolver(
            async (_, { firstName, lastName, username, email, password: newPassword, bio, avatar }, { loggedInUser }) => {
                // Read upload file
                const { filename, createReadStream } = await avatar
                const readStream = createReadStream()
                const writeStream = createWriteStream(process.cwd() + "/uploads/" + filename)
                readStream.pipe(writeStream)

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
                        ...(uglyPassword && { password: uglyPassword })
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