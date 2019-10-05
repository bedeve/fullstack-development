import Song from '../models/song.model'
import {searchSoundcloud} from "../scrapers/soundcloud"
import {searchYoutube} from "../scrapers/youtube"


export const search = async (req, res) => {
  const searchQuery = req.query.search_query
  console.log("TCL: search -> searchQuery", searchQuery)
  const youtubeResults = await searchYoutube(searchQuery)
  const soundcloudResults = await searchSoundcloud(searchQuery)
  
  res.json({soundcloud: soundcloudResults,youtube: youtubeResults , search: searchQuery})
}
