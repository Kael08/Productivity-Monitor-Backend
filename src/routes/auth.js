import dbClient from "../db/client.js"
import express, {query} from "express"
const router = express.Router()

import jwt from "jsonwebtoken"
import bcrypt from "bcryptjs";
import { v4 as uuidv4 } from "uuid"
import crypto from "crypto"

const SECRET_KEY=`your-access-token`
const REFRESH_SECRET=`your-refresh-token`

// POST-запрос на авторизацию пользователя
router.post("/",async(req,res)=>{
    const {login,password} = req.body
    try{
        /*const result = await dbClient.query(
            `SELECT
                user_credentials.*,
                users.id AS user_id,
                users.username AS username
            FROM user_credentials 
            INNER JOIN users
            ON user_credentials.user_id=users.id
            WHERE user_credentials.email=$1`,
            [email]
        )

        if(result.rows.length===0)
            return res.status(404).json({error:"Email не найден"})

        if(result.rows[0].password===password)
            res.status(200).json(result.rows[0])
        else res.status(401).json({error:"Данные неверны"})*/

        // Получения пользователя по логину
        const userCredResult=await dbClient.query(
            `SELECT * FROM users_credentials WHERE login = $1`,
            [login]
        )

        if(userCredResult.rows.length===0)
            return res.status(404).json({error:`Неверный логин или пароль`})

        const userCred=userCredResult.rows[0]

        const isPasswordValid = await bcrypt.compare(password,userCred.password_hash)
        if(!isPasswordValid)
            return res.status(401).json({error:`Неверный логин или пароль`})

        const userResult = await dbClient.query(
            `SELECT * FROM users WHERE id = $1`,
            [userCred.user_id]
        )

        const user=userResult.rows[0]

        const accessToken=jwt.sign(
            {userId: user.id,login:login},
            SECRET_KEY,
            {expiresIn:`1h`}
        )

        const tokenId=uuidv4()
        const refreshToken=jwt.sign(
            {userId:user.id,tokenId},
            REFRESH_SECRET,
            {expiresIn:`30d`}
        )

        const tokenHash=crypto.createHash(`sha256`).update(refreshToken).digest(`hex`)

        const expiresAt=new Date(Date.now()+30*24*60*60*1000)
        await dbClient.query(
            `INSERT INTO refresh_tokens(user_id,token_hash,expires_at) VALUES ($1,$2,$3)`,
            [user.id,tokenHash,expiresAt]
        )

        return res.status(200).json({
            accessToken,
            refreshToken,
            username: user.username
        })


    } catch(error){
        console.error('Ошибка при авторизации',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

// Разлогин
router.post("/logout",async(req,res)=>{
    const{refreshToken}=req.body

    if(!refreshToken)
        return res.status(400).json({error:`Refresh-токен не передан`})
    
    try{
        const tokenHash=crypto.createHash("sha256").update(refreshToken).digest("hex")
        
        await dbClient.query(
            `UPDATE refresh_token SET is_revoked=TRUE WHERE token_hash=$1`,
            [tokenHash]
        )

        res.status(200).json({message:"Выход выполнен успешно"})
    } catch(e){
        res.status(500).json({error:`Ошибка сервера`})
    }
})

// Обновление access-токена
router.post("/refresh",async(req,res)=>{
    const {refreshToken}=req.body

    if(!refreshToken)
        return res.status(400).json({error:"Refresh-токен не передан"})

    try{
        const payload = jwt.verify(refreshToken,REFRESH_SECRET)
        const tokenHash = crypto.createHash("sha256").update(refreshToken).digest("hex")

        const result = await dbClient.query(
            `SELECT * FROM refresh_tokens WHERE token_hash = $1 AND is_revoked=FALSE AND expires_at > NOW()`,
            [tokenHash]
        )

        if(result.rows.length===0)
            return res.status(403).json({error:"Недействительный или отозванный refresh-токен"})

        const newAccessToken=jwt.sign(
            {userId:payload.userId,login:payload.login},
            SECRET_KEY,
            {expiresIn:"1h"}
        )

        res.status(200).json({accessToken:newAccessToken})
    } catch(err){
        console.error("Ошибка при обновлении токена",err)
        res.status(403).json({errpr:"Refresh-токен недействителен или истек"})
    }
})

export default router