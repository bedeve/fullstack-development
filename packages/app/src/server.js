import express from 'express'
import songRoutes from './routes/song.routes'
import artistRoutes from './routes/artist.routes'
const app = express()


// mount routes
app.use('/', artistRoutes)
app.use('/', songRoutes)


export default app