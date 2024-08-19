import express from 'express'
import productRoutes from './routes/productRoutes.js'
import userRoutes from './routes/userRoutes.js'
import orderRoutes from './routes/orderRoutes.js'
import connectDB from './config/db.js'
import cookieParser from 'cookie-parser'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const PORT = 5000

connectDB()

const app = express()

app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(cookieParser())

app.use('/api/products', productRoutes)
app.use('/api/users', userRoutes)
app.use('/api/orders', orderRoutes)

app.get('/api/config/paypal', (req, res) => res.json({clientId: process.env.PAYPAL_CLIENT_ID}))


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))