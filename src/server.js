import http from 'http'
import express from 'express'
import usersRouter from './routes/users.js'
import authRouter from './routes/auth.js'
import regRouter from './routes/reg.js'

const app = express()

app.use(express.json())

// Middleware для CORS
app.use((req,res,next) =>{
  res.setHeader('Access-Control-Allow-Origin', '*')// http://localhost:5173
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, DELETE, OPTIONS')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type')
  if(req.method==='OPTIONS'){
    res.sendStatus(204)// Предварительный запрос на доступ
  } else {
    next()
  }
})

// Роутер для /users
app.use(`/users`,usersRouter)

// Роутер для /auth
app.use(`/auth`,authRouter)

// Роутер для /reg
app.use(`/reg`,regRouter)

// Обработчик для всех остальных путей
app.use((req,res)=> {
  res.status(404).send('Не найден')
})
  
// Запуск сервера
const PORT = process.env.PORT||3000

http.createServer(app).listen(PORT,() => {
  console.log(`🚀 Сервер запущен на http://localhost:${PORT}`)
})