import dbClient from "../db/client.js"
import express, { query } from "express"
const router = express.Router()
import { authenticateToken } from "../middlewares/auth.js"

router.get("/me",authenticateToken,async(req,res)=>{
    try{
        const userId = req.user.userId

        const userResult = await dbClient.query(
            `SELECT * FROM users WHERE id=$1`,
            [userId]
        )

        if(userResult.rows.length===0)
            return res.status(404).json({error:"Пользователь не найден"})

        res.status(200).json(userResult.rows[0])
    }catch(err){
        res.status(500).json({error:"Ошибка сервера"})
    }
})

export default router