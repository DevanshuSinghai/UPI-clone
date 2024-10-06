const zod = require("zod")

const createUser = zod.object({
    username: zod.string(),
    password: zod.string(),
    mail: zod.string().email(),
})

const updateUser = zod.object({
    username: zod.string().min(3).max(30),
    password: zod.string().min(5).max(30)
})

const checkUser = zod.object({
    username: zod.string().min(3).max(30),
    password: zod.string().min(5).max(30)
})

module.exports = {
    createUser,
    updateUser,
    checkUser
}