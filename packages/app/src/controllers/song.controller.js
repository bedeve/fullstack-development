import Song from '../models/song.model'
import Search from '../models/search.model'
import {searchSoundcloud} from "../scrapers/soundcloud"
import {searchYoutube} from "../scrapers/youtube"


export const search = async (req, res) => {
  const searchQuery = req.query.search_query
  console.log("TCL: search -> searchQuery", searchQuery)
  const cachedResultsCount = await Search.count({ // check the deprecation warning
    query: searchQuery
  })
  if(cachedResultsCount === 0){
    const youtubeResults = await searchYoutube(searchQuery)
      .catch(err=>{
        console.error("Youtube scraper error")
        return []
      })
    const soundcloudResults = await searchSoundcloud(searchQuery)
      .catch(err=>{
        console.error("Soundcloud scraper error")
        return []
      })
    const allResults = youtubeResults.concat(soundcloudResults)
    const songs = await Song.create(
      allResults
    )
    await Search.create({
        query: searchQuery, 
        results: songs?songs.map(song=>song._id):[]  
    })
  } 
  const storedSongs = await Search.find({
    query: searchQuery
  }).populate(
    "results", "name url image"
  )
  res.json(storedSongs)
}

const removeAllSearches = async () => {
  await Search.deleteMany({})
  await Song.deleteMany({})
  console.log("Search and Song collections emptied")
}
// removeAllSearches()