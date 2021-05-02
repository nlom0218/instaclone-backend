import client from "../../client"
import bcrypt from "bcrypt"

export default {
    Mutation: {
        editProfile: async (_, { firstName, lastName, username, email, password: newPassword }) => {
            let uglyPassword = null
            if (newPassword) {
                uglyPassword = await bcrypt.hash(newPassword, 10)
            }
            const updatedUser = await client.user.update({
                where: { id: 1 },
                data: { firstName, lastName, username, email, ...(uglyPassword && { password: uglyPassword }) }
            })
            if (updatedUser) {
                return { ok: true }
            } else {
                return { ok: false, error: "프로필을 업데이트 할 수 없습니다." }
            }
        }
    }
}