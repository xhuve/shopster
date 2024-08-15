import express from 'express'
import productRoutes from './routes/productRoutes.js'
import connectDB from './config/db.js'
import { notFound, errorHandler } from './middleware/errorMiddleware.js'

const PORT = 5000

connectDB()

const app = express()

app.use('/api/products', productRoutes)


app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.use(notFound)
app.use(errorHandler)

app.listen(PORT, () => console.log(`Server is running on http://localhost:${PORT}`))