import Song from '../models/song.model'
import Search from '../models/search.model'
import {searchSoundcloud} from "../scrapers/soundcloud"
import {searchYoutube} from "../scrapers/youtube"


export const search = async (req, res) => {
  const searchQuery = req.query.search_query
  const cachedResultsCount = await Search.countDocuments({ // check the deprecation warning
    query: searchQuery
  })
  if(cachedResultsCount === 0){
    console.group("scrape youtube")
    console.log("start")
    const youtubeResults = await searchYoutube(searchQuery)
    .catch(err=>{
      console.log("error")
      return []
    })
    console.log("end")
    console.groupEnd()
    console.group("scrape soundcloud")
    console.log("start")
    const soundcloudResults = await searchSoundcloud(searchQuery)
    .catch((err)=>{
      console.log("error")
      return []
    })
    console.log("end")
    console.groupEnd()
    const allResults = youtubeResults.concat(soundcloudResults)
    const songs = await Song.create(
      allResults
    )
    
    await Search.create({
        query: searchQuery, 
        results: songs?
                  songs.map(song=>song._id):
                  [] 
    })
  } 
  const storedSearch = await Search.findOne({
    query: searchQuery
  }).populate(
    "results", "name url"
  )
  res.json(storedSearch)
}

const removeAllSearches = async () => {
  await Search.deleteMany({})
  await Song.deleteMany({})
  console.log("Search and Song collections emptied")
}
// removeAllSearches()