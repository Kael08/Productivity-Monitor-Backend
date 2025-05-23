import dbClient from "../db/client.js"
import express from "express"
const router = express.Router()
import { authenticateToken } from "../middlewares/auth.js"

// Получение статистики за период
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const { start_date, end_date } = req.query

        if (!start_date || !end_date) {
            return res.status(400).json({ error: 'Поля start_date и end_date обязательны!' })
        }

        const result = await dbClient.query(
            `SELECT
                id,
                user_id,
                date,
                monitoring_time,
                blocked_processes,
                blocked_domains,
                created_at,
                updated_at
            FROM daily_statistics
            WHERE user_id = $1 AND date >= $2 AND date <= $3
            ORDER BY date`,
            [userId, start_date, end_date]
        )

        res.status(200).json(result.rows)
    } catch (e) {
        console.error('Ошибка при получении статистики: ', e)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Добавление или обновление статистики за день
router.post('/add', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const { date, monitoring_time, blocked_processes, blocked_domains } = req.body

        if (!date || !monitoring_time || blocked_processes === undefined || blocked_domains === undefined) {
            return res.status(400).json({ error: 'Поля date, monitoring_time, blocked_processes и blocked_domains обязательны!' })
        }

        const existingStat = await dbClient.query(
            `SELECT * FROM daily_statistics WHERE user_id = $1 AND date = $2`,
            [userId, date]
        )

        if (existingStat.rows.length > 0) {
            const result = await dbClient.query(
                `UPDATE daily_statistics
                 SET monitoring_time = monitoring_time + $3::interval,
                     blocked_processes = blocked_processes + $4,
                     blocked_domains = blocked_domains + $5,
                     updated_at = NOW()
                 WHERE user_id = $1 AND date = $2
                 RETURNING *`,
                [userId, date, monitoring_time, blocked_processes, blocked_domains]
            )
            res.status(200).json({ message: 'Статистика обновлена', stat: result.rows[0] })
        } else {
            const result = await dbClient.query(
                `INSERT INTO daily_statistics (user_id, date, monitoring_time, blocked_processes, blocked_domains)
                 VALUES ($1, $2, $3, $4, $5)
                 RETURNING *`,
                [userId, date, monitoring_time, blocked_processes, blocked_domains]
            )
            res.status(201).json({ message: 'Статистика добавлена', stat: result.rows[0] })
        }
    } catch (e) {
        console.error('Ошибка при добавлении/обновлении статистики: ', e)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

export default router