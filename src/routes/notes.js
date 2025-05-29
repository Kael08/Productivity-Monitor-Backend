import dbClient from "../db/client.js"
import express, { query } from "express"
const router = express.Router()
import { authenticateToken } from "../middlewares/auth.js"

router.get("/",authenticateToken,async(req,res)=>{
    try{
        const userId=req.user.userId

        const notesResult = await dbClient.query(
            `SELECT * FROM notes WHERE user_id=$1`,
            [userId]
        )
        
        res.status(200).json(notesResult.rows)
    }catch(err){
        res.status(500).json({error:"Ошибка сервера"})
    }
})

router.post("/add",authenticateToken,async(req,res)=>{
    try{
        const userId = req.user.userId
        const { title, content } = req.body

        // Валидация входных данных
        if (!title || !content) {
            return res.status(400).json({ error: "Поля title и content обязательны" })
        }

        // Проверка существования пользователя
        const userCheck = await dbClient.query(
            `SELECT * FROM users WHERE id=$1`,
            [userId]
        )

        if (userCheck.rows.length !== 1)
            return res.status, { error: "Пользователь не найден" }


        // Вставка заметки и возврат созданной записи
        const newNote = await dbClient.query(
            `INSERT INTO notes (user_id, title, content) 
             VALUES ($1, $2, $3) 
             RETURNING *`,
            [userId, title, content]
        )

        res.status(201).json(newNote.rows[0])
    }catch(e){
        console.error('Ошибка при добавлении заметки:', e)
        res.status(500).json({ error: "Ошибка сервера" })
    }
})

// Обновление заметки
router.patch("/update", authenticateToken, async (req, res) => {
    try {
        console.log('PATCH /notes/update, userId:', req.user.userId, 'body:', req.body)
        const userId = req.user.userId
        const { note_id, title, content } = req.body

        // Валидация note_id
        if (!note_id) {
            return res.status(400).json({ error: "Поле note_id обязательно" })
        }

        // Валидация длины полей
        if (title && title.length > 255) {
            return res.status(400).json({ error: "Поле title слишком длинное (максимум 255 символов)" })
        }
        if (content && content.length > 10000) {
            return res.status(400).json({ error: "Поле content слишком длинное (максимум 10000 символов)" })
        }

        // Проверка существования заметки
        const noteCheck = await dbClient.query(
            `SELECT * FROM notes WHERE user_id=$1 AND id=$2`,
            [userId, note_id]
        )

        if (noteCheck.rows.length !== 1) {
            return res.status(404).json({ error: "Заметка не найдена или не принадлежит пользователю" })
        }

        // Подготавливаем поля для обновления
        const updateFields = []
        const updateValues = []
        let paramCount = 1

        if (title !== undefined) {
            updateFields.push(`title = $${paramCount}`)
            updateValues.push(title)
            paramCount++
        }

        if (content !== undefined) {
            updateFields.push(`content = $${paramCount}`)
            updateValues.push(content)
            paramCount++
        }

        // Если не передано ни одного поля для обновления
        if (updateFields.length === 0) {
            return res.status(400).json({ error: "Не указаны поля для обновления" })
        }

        // Добавляем note_id в параметры
        updateValues.push(note_id)

        // Выполняем обновление
        const updatedNote = await dbClient.query(
            `UPDATE notes
             SET ${updateFields.join(', ')}, updated_at = NOW()
             WHERE id = $${paramCount}
             RETURNING *`,
            updateValues
        )

        res.status(200).json({
            message: "Заметка успешно обновлена",
            note: updatedNote.rows[0]
        })
    } catch (e) {
        console.error('Ошибка при обновлении заметки:', e)
        res.status(500).json({ error: "Ошибка сервера" })
    }
})

// Удаление заметки
router.delete("/delete", authenticateToken, async (req, res) => {
    try {
        console.log('DELETE /notes/delete, userId:', req.user.userId, 'body:', req.body)
        const userId = req.user.userId
        const { note_id } = req.body

        // Валидация входных данных
        if (!note_id) {
            return res.status(400).json({ error: "Поле note_id обязательно" })
        }

        // Проверка существования заметки
        const noteCheck = await dbClient.query(
            `SELECT * FROM notes WHERE user_id=$1 AND id=$2`,
            [userId, note_id]
        )

        if (noteCheck.rows.length !== 1) {
            return res.status(404).json({ error: "Заметка не найдена или не принадлежит пользователю" })
        }

        // Удаление заметки
        await dbClient.query(
            `DELETE FROM notes WHERE id=$1`,
            [note_id]
        )

        res.status(200).json({ message: "Заметка успешно удалена" })
    } catch (e) {
        console.error('Ошибка при удалении заметки:', e)
        res.status(500).json({ error: "Ошибка сервера" })
    }
})


export default router