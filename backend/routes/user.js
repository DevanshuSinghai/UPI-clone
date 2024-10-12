const express = require("express");
const { createUser, updateUser, checkUser } = require("../schemaCheck");
const { User, Account } = require("../db");
const jwt = require("jsonwebtoken")
const router = express.Router()
const { JWT_SECRET} = require("../KEYS/config")
const { authMiddleware } = require("../middlewares/middleware")


router.post("/signup", async(req, res)=>{
    
    const payload = req.body;
    const parsedPayload = createUser.safeParse(payload)

    if(!parsedPayload.success){
        return res.status(411).json({
            msg: "fill details correctly"
        })
    }
    const existingUser = await User.findOne({mail:payload.mail})
    if(existingUser){
        return res.json({
            msg: "User with this email already exists"
        })
    }

    const user = await User.create({
        username: payload.username,
        password: payload.password,
        mail: payload.mail
    })
    const userId = user._id;
    const signature = jwt.sign({userId}, JWT_SECRET)

    // giving user a dummy balance
    await Account.create({
        userId,
        balance: 1+ Math.random()*10000
    })

    return res.json({
        msg: "user created successfully",
        token: signature
    })
})


router.post("/signin", async(req, res)=>{
    const payload = req.body
    const {success} = checkUser.safeParse(payload)
    if(!success){
        res.status(403).json({
            msg:"enter details properly"
        })
    }

    const user = await User.findOne({
        username:payload.username,
        password:payload.password
    })

    if(user){
        const token = jwt.sign({
            userId: user._id
        }, JWT_SECRET)

        res.json({
            token: token
        })
        return
    }

    res.status(411).json({
        msg: "Error while logging in"
    })
})


router.put("/", authMiddleware, async(req, res)=>{
    const payload = req.body
    const {success} = updateUser.safeParse(payload) 
    if(!success){
        return res.status(411).json({
            msg: "error while updating information"
        })
    }
    await User.updateOne({
        _id: req.userId
    },{$set:{username:payload.username,
        password:payload.password
    }})

    return res.json({
        msg: "user updated succesfully"
    })
})


router.get("/bulk", authMiddleware, async(req, res)=>{
    const filter = req.query.filter || ""; // filter is used to filter the name based on user input, the empty string is used to return everything i.e when user not entered anything we will show every user to him

    const users = await User.find({
        username: { // for ex- user inputted - "de" than all the username consisting "de" will be shown
            "$regex": filter
        }
    })

    res.json({
        user: users.map(user =>({ // map is used to show all the names
            username: user.username,
            mail: user.mail,
            _id: user._id
        }))
    })
})

// used to navigate user directly to dashboard if user already signedup or logged in before
router.get("/check", authMiddleware, (req,res)=>{
    res.json({
        success: "true"
    })
})

module.exports = router