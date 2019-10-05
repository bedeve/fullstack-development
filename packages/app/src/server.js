import express from 'express'
import songRoutes from './routes/song.routes'
const app = express()


// mount routes
app.use('/', songRoutes)


export default app