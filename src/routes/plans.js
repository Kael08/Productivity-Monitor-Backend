import dbClient from "../db/client.js"
import express, { query } from "express"
const router = express.Router()
import { authenticateToken } from "../middlewares/auth.js"

// Получение всех to-do листов с задачами
router.get('/', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId

        const result = await dbClient.query(
            `SELECT 
                tl.id AS list_id,
                tl.title AS list_title,
                tl.created_at AS list_created_at,
                tl.updated_at AS list_updated_at,
                ti.id AS item_id,
                ti.description AS item_description,
                ti.is_completed AS item_is_completed,
                ti.priority AS item_priority,
                ti.created_at AS item_created_at,
                ti.updated_at AS item_updated_at,
                ti.deadline AS item_deadline
             FROM todo_lists tl
             LEFT JOIN todo_items ti ON tl.id = ti.todo_list_id
             WHERE tl.user_id = $1
             ORDER BY tl.id, ti.id`,
            [userId]
        )

        // Группировка результатов
        const lists = []
        const listMap = new Map()

        for (const row of result.rows) {
            const listId = row.list_id

            if (!listMap.has(listId)) {
                listMap.set(listId, {
                    id: listId,
                    title: row.list_title,
                    created_at: row.list_created_at,
                    updated_at: row.list_updated_at,
                    items: []
                })
                lists.push(listMap.get(listId))
            }

            if (row.item_id) {
                listMap.get(listId).items.push({
                    id: row.item_id,
                    description: row.item_description,
                    is_completed: row.item_is_completed,
                    priority: row.item_priority,
                    deadline: row.item_deadline,
                    created_at: row.item_created_at,
                    updated_at: row.item_updated_at
                })
            }
        }

        res.status(200).json(lists)
    } catch (err) {
        console.error('Ошибка при получении to-do листов:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Добавление нового to-do листа
router.post('/add', authenticateToken, async (req, res) => {
    console.log('POST /todo-lists/add called with body:', req.body)
    console.log('User ID from token:', req.user.userId)
    try {
        const userId = req.user.userId
        const { title } = req.body
        if (!title) {
            console.log('Missing title')
            return res.status(400).json({ error: 'Поле title обязательно' })
        }
        if (title.length > 255) {
            console.log('Title too long')
            return res.status(400).json({ error: 'Поле title слишком длинное (максимум 255 символов)' })
        }
        const result = await dbClient.query(
            `INSERT INTO todo_lists (user_id, title)
             VALUES ($1, $2)
             RETURNING *`,
            [userId, title]
        )
        console.log('Inserted list:', result.rows[0])
        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error('Ошибка при добавлении to-do листа:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Обновление to-do листа
router.patch('/update', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const { list_id, title } = req.body

        if (!list_id) {
            return res.status(400).json({ error: 'Поле list_id обязательно' })
        }

        if (!title) {
            return res.status(400).json({ error: 'Поле title обязательно для обновления' })
        }

        if (title.length > 255) {
            return res.status(400).json({ error: 'Поле title слишком длинное (максимум 255 символов)' })
        }

        const listCheck = await dbClient.query(
            `SELECT * FROM todo_lists WHERE id = $1 AND user_id = $2`,
            [list_id, userId]
        )

        if (listCheck.rows.length !== 1) {
            return res.status(404).json({ error: 'Список не найден или не принадлежит пользователю' })
        }

        const result = await dbClient.query(
            `UPDATE todo_lists
             SET title = $1, updated_at = NOW()
             WHERE id = $2 AND user_id = $3
             RETURNING *`,
            [title, list_id, userId]
        )

        res.status(200).json({
            message: 'Список успешно обновлен',
            list: result.rows[0]
        })
    } catch (err) {
        console.error('Ошибка при обновлении to-do листа:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Удаление to-do листа и всех его задач
router.delete('/delete', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const { list_id } = req.body

        if (!list_id) {
            return res.status(400).json({ error: 'Поле list_id обязательно' })
        }

        const listCheck = await dbClient.query(
            `SELECT * FROM todo_lists WHERE id = $1 AND user_id = $2`,
            [list_id, userId]
        )

        if (listCheck.rows.length !== 1) {
            return res.status(404).json({ error: 'Список не найден или не принадлежит пользователю' })
        }

        // Удаляем все задачи, связанные с листом
        await dbClient.query(
            `DELETE FROM todo_items WHERE todo_list_id = $1`,
            [list_id]
        )

        // Удаляем сам лист
        await dbClient.query(
            `DELETE FROM todo_lists WHERE id = $1 AND user_id = $2`,
            [list_id, userId]
        )

        res.status(200).json({ message: 'Список и его задачи успешно удалены' })
    } catch (err) {
        console.error('Ошибка при удалении to-do листа:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Добавление задачи в to-do лист
router.post('/items/add', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const { list_id, description, priority,deadline} = req.body

        if (!list_id || !description) {
            return res.status(400).json({ error: 'Поля list_id и description обязательны' })
        }

        const listCheck = await dbClient.query(
            `SELECT * FROM todo_lists WHERE id = $1 AND user_id = $2`,
            [list_id, userId]
        )

        if (listCheck.rows.length !== 1) {
            return res.status(404).json({ error: 'Список не найден или не принадлежит пользователю' })
        }

        if (description.length > 1000) {
            return res.status(400).json({ error: 'Поле description слишком длинное (максимум 1000 символов)' })
        }

        if (priority !== undefined && (priority < 0 || priority > 10)) {
            return res.status(400).json({ error: 'Приоритет должен быть от 0 до 10' })
        }

        // Обработка deadline
        let formattedDeadline = null
        if (deadline !== undefined && deadline !== null && deadline !== "") {
            // Проверка формата YYYY-MM-DD
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/
            if (!dateRegex.test(deadline)) {
                return res.status(400).json({ error: 'Некорректный формат даты. Используйте YYYY-MM-DD' })
            }

            // Проверка валидности даты
            const dateObj = new Date(deadline)
            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({ error: 'Некорректная дата' })
            }

            formattedDeadline = deadline
        }

        const result = await dbClient.query(
            `INSERT INTO todo_items (todo_list_id, description, priority, deadline)
             VALUES ($1, $2, $3, $4)
             RETURNING *`,
            [list_id, description, priority || 0,deadline||null]
        )

        res.status(201).json(result.rows[0])
    } catch (err) {
        console.error('Ошибка при добавлении задачи:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Обновление задачи
router.patch('/items/update', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const { item_id, description, is_completed, priority, deadline} = req.body

        if (!item_id) {
            return res.status(400).json({ error: 'Поле item_id обязательно' })
        }

        const itemCheck = await dbClient.query(
            `SELECT ti.*, tl.user_id
             FROM todo_items ti
             JOIN todo_lists tl ON ti.todo_list_id = tl.id
             WHERE ti.id = $1 AND tl.user_id = $2`,
            [item_id, userId]
        )

        if (itemCheck.rows.length !== 1) {
            return res.status(404).json({ error: 'Задача не найдена или не принадлежит пользователю' })
        }

        const updateFields = []
        const updateValues = []
        let paramCount = 1

        if (description !== undefined) {
            if (description.length > 1000) {
                return res.status(400).json({ error: 'Поле description слишком длинное (максимум 1000 символов)' })
            }
            updateFields.push(`description = $${paramCount}`)
            updateValues.push(description)
            paramCount++
        }

        if (is_completed !== undefined) {
            updateFields.push(`is_completed = $${paramCount}`)
            updateValues.push(is_completed)
            paramCount++
        }

        if (priority !== undefined) {
            if (priority < 0 || priority > 10) {
                return res.status(400).json({ error: 'Приоритет должен быть от 0 до 10' })
            }
            updateFields.push(`priority = $${paramCount}`)
            updateValues.push(priority)
            paramCount++
        }

        // Обработка deadline
        let formattedDeadline = null
        if (deadline !== undefined && deadline !== null && deadline !== "") {
            // Проверка формата YYYY-MM-DD
            const dateRegex = /^\d{4}-\d{2}-\d{2}$/
            if (!dateRegex.test(deadline)) {
                return res.status(400).json({ error: 'Некорректный формат даты. Используйте YYYY-MM-DD' })
            }

            // Проверка валидности даты
            const dateObj = new Date(deadline)
            if (isNaN(dateObj.getTime())) {
                return res.status(400).json({ error: 'Некорректная дата' })
            }

            formattedDeadline = deadline
            updateFields.push(`deadline = $${paramCount}`)
            updateValues.push(formattedDeadline)
            paramCount++
        }

        if (updateFields.length === 0) {
            return res.status(400).json({ error: 'Не указаны поля для обновления' })
        }

        updateValues.push(item_id)

        const result = await dbClient.query(
            `UPDATE todo_items
             SET ${updateFields.join(', ')}, updated_at = NOW()
             WHERE id = $${paramCount}
             RETURNING *`,
            updateValues
        )

        res.status(200).json({
            message: 'Задача успешно обновлена',
            item: result.rows[0]
        })
    } catch (err) {
        console.error('Ошибка при обновлении задачи:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})

// Удаление задачи
router.delete('/items/delete', authenticateToken, async (req, res) => {
    try {
        const userId = req.user.userId
        const { item_id } = req.body

        if (!item_id) {
            return res.status(400).json({ error: 'Поле item_id обязательно' })
        }

        const itemCheck = await dbClient.query(
            `SELECT ti.*, tl.user_id
             FROM todo_items ti
             JOIN todo_lists tl ON ti.todo_list_id = tl.id
             WHERE ti.id = $1 AND tl.user_id = $2`,
            [item_id, userId]
        )

        if (itemCheck.rows.length !== 1) {
            return res.status(404).json({ error: 'Задача не найдена или не принадлежит пользователю' })
        }

        await dbClient.query(
            `DELETE FROM todo_items WHERE id = $1`,
            [item_id]
        )

        res.status(200).json({ message: 'Задача успешно удалена' })
    } catch (err) {
        console.error('Ошибка при удалении задачи:', err)
        res.status(500).json({ error: 'Ошибка сервера' })
    }
})



export default router