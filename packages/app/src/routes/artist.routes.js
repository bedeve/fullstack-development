 
import express from 'express'
import {search} from "../controllers/artist.controller"
const router = express.Router()

router.route('/api/artists')
  .get(
    search
  )

  export default router