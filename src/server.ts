import express, { type Application, type Request, type Response } from 'express'
const app :Application = express()
const port = 3000

app.use(express.json())


app.get('/', (req : Request, res : Response) => {
  res.send('Hello World!')
})

app.post ('/',async(req:Request,res:Response)=>{
  console.log(req.body)
})


app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})