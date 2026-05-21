import express, { type Application, type Request, type Response } from 'express'
const app :Application = express()
const port = 3000
import {Pool} from "pg"

// middleware
app.use(express.json())

// db connection
const pool =new Pool({
connectionString: "postgresql://neondb_owner:npg_5EXFSGobhY9j@ep-young-bar-aozmg4su-pooler.c-2.ap-southeast-1.aws.neon.tech/neondb?sslmode=require&channel_binding=require"
})

app.get('/', (req : Request, res : Response) => {
  res.send('Hello World!')
})

app.post ('/',async(req:Request,res:Response)=>{
  console.log(req.body)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})