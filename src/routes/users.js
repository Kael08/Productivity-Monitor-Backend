import dbClient from "../db/client.js"
import express, { query } from "express"
const router = express.Router()

// GET-запрос для получения списка пользователей
router.get('/',async(req,res)=>{
    try{
        const result = await dbClient.query(
            `SELECT
                user_credentials.*,
                users.id AS user_id,
                users.username AS username
            FROM user_credentials
            INNER JOIN users
            ON user_credentials.user_id = users.id`
        )
        res.status(200).json(result.rows)
    } catch(error){
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

// POST-запрос на добавление нового пользователя
router.post('/add',async(req,res)=>{
    const {email,password,username} = req.body

    if(!email&&!password&&!username){
        return res.status(400).json({error:"Почта, пароль, и имя пользователя не должны быть пустыми"})
    }

    try{
        const emailCheck = await dbClient.query(
            "SELECT * FROM user_credentials WHERE email=$1",
            [email]
        )

        if(emailCheck.rows.length>0)
            return res.status(400).json({error:"Данная почта уже занята!"})

        const userResult = await dbClient.query(
            "INSERT INTO users (username) VALUES ($1) RETURNING id",
            [username]
        )

        const user_id=userResult.rows[0].id

        await dbClient.query(
            "INSERT INTO user_credentials (email,password,user_id) VALUES ($1,$2,$3)",
            [email,password,user_id]
        )

        res.status(201).json("Пользователь успешно добавлен!")


    } catch(error){
        console.error('Ошибка при выполнении запроса',error.stack)
        res.status(500).json({error:"Ошибка сервера:",details:error})
    }
})

// DELETE-запрос на удаление пользователя по id
router.delete('/delete/:id', async (req, res) => {
    const { id } = req.params;

    try {
        const idCheck = await dbClient.query(
            "SELECT * FROM user_credentials WHERE id = $1",
            [id]
        );

        if (idCheck.rows.length === 0) {
            return res.status(404).json({ error: "Пользователь не найден!" });
        }

        const user_id = idCheck.rows[0].user_id;

        await dbClient.query(
            "DELETE FROM user_credentials WHERE id = $1",
            [id]
        );

        await dbClient.query(
            "DELETE FROM users WHERE id = $1",
            [user_id]
        );

        res.status(204).send();
    } catch (error) {
        console.error('Ошибка при выполнении запроса', error.stack);
        res.status(500).json({ error: "Ошибка сервера:", details: error });
    }
});


export default router