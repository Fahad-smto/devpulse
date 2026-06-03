import { pool } from "../../db/index.js";


const createUserIntoDB =async(payload:any)=>{

        const { name, email, password } =  payload

        const result = await pool.query(
            `INSERT INTO users (name,email,password) VALUES ($1, $2, $3) RETURNING *`,
            [name, email, password]
        );

        console.log(result.rows[0])

 
}

export const userService ={
    createUserIntoDB
}