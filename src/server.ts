import express, { response, type Application, type Request, type Response } from 'express'
const app: Application = express()
const port = config.port
import { Pool } from "pg"
import config from './config/index.js'

// middleware
app.use(express.json())

// db connection
const pool = new Pool({
  connectionString: config.connectionString
})

const initDb = async () => {
  try {
    // users table -  
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

    // issues table -  
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

    console.log(' Database initialized successfully')
  } catch (err) {
    console.error('Error initializing database:', err)
  }
}
 
initDb()

app.get('/', (req: Request, res: Response) => {
  res.send('Hello World!')
})


app.post('/', async (req: Request, res: Response) => {
  try {

    const { name, email, password } = req.body

    const result = await pool.query(
      `INSERT INTO users (name,email,password) VALUES ($1, $2, $3) RETURNING *`,
      [name, email, password]
    );

    console.log(result.rows[0])


    console.log(req.body)
    res.status(200).json({
      message: 'Data received successfully',
      success: true,
      data: {
        name,
        email,
        password
      }
    })
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
      errors: err.stack
    });
  }
})


app.get('/users', async (req: Request, res: Response) => {
  try {
    const result = await pool.query('SELECT * FROM users');

    res.status(200).json({
      success: true,
      data: result.rows
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
      errors: err.stack
    });
  }
})

app.get('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const result = await pool.query('SELECT * FROM users WHERE id = $1', [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
      errors: err.stack
    });
  }
})

app.put('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;
    const { name, email, password } = req.body;

    const result = await pool.query(
      `UPDATE users SET name =COALESCE($1,name) ,
       email =COALESCE ($2,email),
        password = COALESCE($3,password)
         WHERE id = $4 RETURNING *`,
      [name, email, password, userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
      errors: err.stack
    });
  }
});

app.delete('/users/:id', async (req: Request, res: Response) => {
  try {
    const userId = req.params.id;

    const result = await pool.query(`DELETE FROM users WHERE id = $1 RETURNING *`, [userId]);

    if (result.rows.length === 0) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result.rows[0]
    });
  } catch (err: any) {
    res.status(500).json({
      success: false,
      message: err.message || 'Internal server error',
      errors: err.stack
    });
  }
});

app._router.stack.forEach((middleware: any) => {
  if (middleware.route) {
    const method = Object.keys(middleware.route.methods)[0].toUpperCase(); 


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})