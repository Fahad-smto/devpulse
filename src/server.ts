import express, { type Application, type Request, type Response } from 'express'
const app: Application = express()
const port = 3000
import { Pool } from "pg"

// middleware
app.use(express.json())

// db connection
const pool = new Pool({
  connectionString: "postgresql://neondb_owner:npg_5EXFSGobhY9j@ep-young-bar-aozmg4su-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

const initDb = async () => {
  try {
    // users table - সঠিক সিনট্যাক্স
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) NOT NULL DEFAULT 'contributor',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    // issues table - assignment অনুযায়ী
    await pool.query(`
      CREATE TABLE IF NOT EXISTS issues (
        id SERIAL PRIMARY KEY,
        title VARCHAR(150) NOT NULL,
        description TEXT NOT NULL,
        type VARCHAR(50) NOT NULL,
        status VARCHAR(50) DEFAULT 'open',
        reporter_id INTEGER NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `)

    console.log('✅ Database initialized successfully')
  } catch (err) {
    console.error('Error initializing database:', err)
  }
}

initDb()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})

app.post('/', async (req: Request, res: Response) => {

  const { name, email, password } = req.body

  const result = await pool.query(
    'INSERT INTO users (name,email,password) VALUES ($1, $2, $3) RETURNING *',
  );

  console.log(result)


  console.log(req.body)
  res.status(200).json({
    message: 'Data received successfully',
    success: true,
    data:{
      name,
      email,
      password  
    }
  })
})

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})