import express from "express"
import dotenv from "dotenv"
import bodyParser from "body-parser";

import authRoutes from './routes/auth.route.js'
import { connectDB } from './lib/db.js'

const app = express()
dotenv.config()

const PORT = process.env.PORT

app.use(express())
app.use(express.json())
app.use(bodyParser.json())

app.use('/api/auth',authRoutes)

app.listen(PORT,() => {
    console.log(`Server is running on port: ${PORT}`)
    connectDB()
})