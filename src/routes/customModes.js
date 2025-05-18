import dbClient from "../db/client.js"
import express from "express"
const router = express.Router()
import { authenticateToken } from "../middlewares/auth.js"

// Получение всех кастомных режимов пользователя
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId

        const result = await dbClient.query(
            `SELECT
                id,
                user_id,
                name,
                mode_name,
                process_list,
                url_list,
                is_domain_blocker_active,
                created_at,
                updated_at
            FROM custom_modes
            WHERE user_id = $1
            ORDER BY id`,
            [userId]
        )

        res.status(200).json(result.rows)
    } catch (e) {
        console.error('Ошибка при получении кастомных режимов: ', e)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Добавление нового кастомного режима
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const { name, mode_name, process_list, url_list, is_domain_blocker_active } = req.body

        if (!name || !mode_name || !process_list || !url_list || is_domain_blocker_active === undefined) {
            return res.status(400).json({ error: 'Поля name, mode_name, process_list, url_list и is_domain_blocker_active обязательны!' })
        }

        if (name.length > 256 || mode_name.length > 256) {
            return res.status(400).json({ error: 'Поля name и mode_name не должны превышать 256 символов!' })
        }

        // Проверка на уникальность имени режима для пользователя
        const existingMode = await dbClient.query(
            `SELECT * FROM custom_modes WHERE user_id = $1 AND name = $2`,
            [userId, name]
        )
        if (existingMode.rows.length > 0) {
            return res.status(409).json({ error: 'Режим с таким именем уже существует для данного пользователя!' })
        }

        const result = await dbClient.query(
            `INSERT INTO custom_modes (user_id, name, mode_name, process_list, url_list, is_domain_blocker_active)
             VALUES ($1, $2, $3, $4, $5, $6)
             RETURNING *`,
            [userId, name, mode_name, process_list, url_list, is_domain_blocker_active]
        )

        res.status(201).json(result.rows[0])
    } catch (e) {
        console.error('Ошибка при добавлении кастомного режима: ', e)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

router.patch('/update', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const { name, mode_name, process_list, url_list, is_domain_blocker_active } = req.body

        if (!name) {
            return res.status(400).json({ error: 'Поле name обязательно!' })
        }

        const modeCheck = await dbClient.query(
            `SELECT * FROM custom_modes WHERE user_id = $1 AND name = $2`,
            [userId, name]
        )

        if (modeCheck.rows.length !== 1) {
            return res.status(404).json({ error: 'Режим с таким именем не найден или не принадлежит пользователю' })
        }

        const updateFields = []
        const updateValues = [userId] // userId как $1
        let paramCount = 2 // Начинаем с $2 для обновляемых полей

        if (mode_name !== undefined) {
            if (mode_name.length > 256) {
                return res.status(400).json({ error: 'Поле mode_name слишком длинное (максимум 256 символов)' })
            }
            updateFields.push(`mode_name = $${paramCount}`)
            updateValues.push(mode_name)
            paramCount++
        }

        if (process_list !== undefined) {
            updateFields.push(`process_list = $${paramCount}`)
            updateValues.push(process_list)
            paramCount++
        }

        if (url_list !== undefined) {
            updateFields.push(`url_list = $${paramCount}`)
            updateValues.push(url_list)
            paramCount++
        }

        if (is_domain_blocker_active !== undefined) {
            updateFields.push(`is_domain_blocker_active = $${paramCount}`)
            updateValues.push(is_domain_blocker_active)
            paramCount++
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'Не указаны поля для обновления' })
        }

        updateValues.push(name) // name как последний параметр

        const result = await dbClient.query(
            `UPDATE custom_modes
             SET ${updateFields.join(', ')}, updated_at = NOW()
             WHERE user_id = $1 AND name = $${paramCount}
             RETURNING *`,
            updateValues
        )

        res.status(200).json({
            message: 'Режим успешно обновлен',
            mode: result.rows[0]
        })
    } catch (err) {
        console.error('Ошибка при обновлении кастомного режима:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Удаление кастомного режима
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const { name } = req.body

        if (!name) {
            return res.status(400).json({ error: 'Поле name обязательно' })
        }

        const modeCheck = await dbClient.query(
            `SELECT * FROM custom_modes WHERE user_id = $1 AND name = $2`,
            [userId, name]
        )

        if (modeCheck.rows.length !== 1) {
            return res.status(404).json({ error: 'Режим с таким именем не найден или не принадлежит пользователю' })
        }

        await dbClient.query(
            `DELETE FROM custom_modes WHERE user_id = $1 AND name = $2`,
            [userId, name]
        )

        res.status(200).json({ message: 'Режим успешно удален' })
    } catch (err) {
        console.error('Ошибка при удалении кастомного режима:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

export default router