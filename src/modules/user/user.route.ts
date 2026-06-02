import { Router, type Request, type Response } from "express";
import { pool } from "../../db/index.js";


const router =Router()

router.post('/', async (req: Request, res: Response) => {
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




export const userRouter = router