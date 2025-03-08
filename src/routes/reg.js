import dbClient from "../db/client.js";
import express, {query} from "express"
const router = express.Router()

// POST-запрос на регистрацию нового пользователя
router.post("/",async(req,res)=>{
    const {email,password}= req.body
    let {username} = req.body
    try{
        if(!username)
            username="user"

        const emailCheck = await dbClient.query(
            "SELECT * FROM user_credentials WHERE email=$1",
            [email]
        )

        if(emailCheck.rows.length!=0)
            return res.status(400).json({error:"Данный Email уже занят"})

        const userResult = await dbClient.query(
            "INSERT INTO users (username) VALUES ($1) RETURNING id",
            [username]
        )

        await dbClient.query(
            "INSERT INTO user_credentials (email,password,user_id) VALUES ($1,$2,$3)",
            [email,password,userResult.rows[0].id]
        )

        res.status(201).json("Пользователь успешно зарегестрирован")
    }catch(error){
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

export default router