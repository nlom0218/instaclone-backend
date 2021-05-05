import client from "../../client"
import bcrypt from "bcrypt"

export default {
    Mutation: {
        createAccount: async (_, { firstName, lastName, username, email, password, }) => {
            try {
                // check if username or email are already on DB
                const existingUser = await client.user.findFirst({
                    where: {
                        OR: [{ username }, { email }]
                    }
                })
                if (existingUser) {
                    return {
                        ok: false,
                        error: "이메일 혹은 이름이 이미 존재합니다."
                    }
                }
                // hash password
                const uglyPassword = await bcrypt.hash(password, 10)
                // save and the user
                await client.user.create({
                    data: {
                        username, email, firstName, lastName, password: uglyPassword
                    }
                })
                return {
                    ok: true
                }
            } catch (err) {
                console.log(err);
            }
        }
    }
}