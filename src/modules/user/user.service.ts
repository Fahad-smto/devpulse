import { pool } from "../../db/index.js";


const createUserIntoDB =async(payload:any)=>{

        const { name, email, password } = req.body

        const result = await pool.query(
            `INSERT INTO users (name,email,password) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, password]
        );

        console.log(result.rows[0])


        console.log(req.body)
}