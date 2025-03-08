import pkg from 'pg'
const { Client} = pkg

const dbClient = new Client({
    user:'postgres',
    host:'localhost',
    database:'productivity-monitor-db',
    password:'5567',
    post: 5432,
})

dbClient.connect()
    .then(()=>console.log("Connected to PostgreSQL"))
    .catch((err) => console.error('Connection error' , err.stack))

export default dbClient