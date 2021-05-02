import client from "../../client"
import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"

export default {
    Mutation: {
        login: async (_, { username, password }) => {
            try {
                // find user with args.username
                const user = await client.user.findFirst({ where: { username } })
                if (!user) {
                    return {
                        ok: false,
                        error: "사용자를 찾을 수 없습니다."
                    }
                }
                // check password with args.password
                const passwordOk = await bcrypt.compare(password, user.password)
                if (!passwordOk) {
                    return {
                        ok: false,
                        error: "비밀번호가 다릅니다."
                    }
                }
                // issue a token and send it to the user
                const token = await jwt.sign({ id: user.id }, process.env.SECRET_KEY)
                return {
                    ok: true,
                    token
                }

            } catch (err) {
                return err
            }
        }
    }
}