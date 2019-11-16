 
import express from 'express'
import {search} from "../controllers/artist.controller"
const router = express.Router()
// GET http://localhost:3000/api/artists?search_query=Bob Marley
router.route('/api/artists')
  .get(
    search
  )

  export default router