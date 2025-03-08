import dbClient from "../db/client.js";
import express, {query} from "express"
const router = express.Router()

// POST-запрос на авторизацию пользователя
router.post("/",async(req,res)=>{
    const {email,password} = req.body
    try{
        const result = await dbClient.query(
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
        else res.status(401).json({error:"Данные неверны"})
    } catch(error){
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

export default router