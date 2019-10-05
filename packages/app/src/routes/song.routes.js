 
import express from 'express'
import {search} from "../controllers/song.controller"
const router = express.Router()

router.route('/api/songs')
  .get(
    search
    )

  export default router