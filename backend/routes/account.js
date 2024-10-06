const express = require("express")
const { authMiddleware } = require("../middlewares/middleware")
const { Account } = require("../db")
const { mongoose } = require("mongoose")

const router = express.Router()


router.get("/balance", authMiddleware, async(req, res)=>{
    const account = await Account.findOne({
        userId: req.userId
    })

    res.json({
        balance: account.balance
    })
})

router.post("/transfer", authMiddleware, async(req, res)=>{
    try{
        const session = await mongoose.startSession(); // starting a session because Transaction are managed through sessions

        session.startTransaction(); // mongoose transactions are used to execute multiple database operations within single transactions, ensuring that they are either all successful or none of them are/
        const { amount, to } = req.body

        // fetch the account from which transaction initiates
        const account = await Account.findOne({userId: req.userId}).session(session);
        // in the end we add .session(session) is used to indicate that the operation should be part of a MongoDB transaction. When you perform operations within a transaction in MongoDB, you need to associate those operations with a specific session. This ensures that all the operations are executed atomically. If any operation fails, you can roll back the entire transaction, maintaining data integrity.

        // Here's a brief overview of how it works:

        // Session: A session is created when you start a transaction. It keeps track of all operations performed within that transaction.
        // Atomicity: By associating your create operation with the session, you're ensuring that it will either complete successfully along with all other operations in the transaction or none of them will apply if there is an error.

        if(!account || account.balance < amount){
            await session.abortTransaction()
            return res.status(400).json({
                msg: "Insufficient balance"
            })
        }

        // fetch the account to which transaction goes
        const toAccount = await Account.findOne({userId: to}).session(session)

        if(!toAccount){
            await session.abortTransaction()
            return res.status(400).json({
                msg: "Invalid Account"
            })
        }

        // decrease the amount from account from which transaction initiates
        await Account.updateOne({userId: req.userId},{$inc:{balance: -amount}}).session(session)

        // adding amount to account to which transaction goes
        await Account.updateOne({userId: to},{$inc:{balance: amount}}).session(session)

        // after commit transaction all the code between startTransaction() and commitTransaction() will be successfully executed and if there is some error than all the code b/w them will roll back
        await session.commitTransaction(); 
        res.json({
            msg: "Transfer Successful"
        })
    }catch(err){
        res.status(411).json({
            err: "some error occured"
        })
    }
})

module.exports = router