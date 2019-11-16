import Artist from '../models/artist.model'
import Search from '../models/search.model'
import {searchBandCamp} from "../scrapers/bandcamp"
import {searchMusicBrainz} from "../scrapers/musicbrainz"
import {searchSpotify} from "../scrapers/spotify"


export const search = async (req, res) => {
  const searchQuery = req.query.search_query
  const cachedResultsCount = await Search.countDocuments({ // check the deprecation warning
    query: searchQuery
  })
  if(cachedResultsCount === 0){
    console.group("scrape musicbrainz")
    console.log("start")
    const musicbrainzResults = await searchMusicBrainz(searchQuery)
    .catch(err=>{
      console.log("error")
      return []
    })
    console.log("end")
    console.groupEnd()
    console.group("scrape bandcamp")
    console.log("start")
    const bandcampResults = await searchBandCamp(searchQuery)
    .catch((err)=>{
      console.log("error")
      return []
    })
    console.log("end")
    console.groupEnd()
    const allResults = musicbrainzResults.concat(bandcampResults)
    const artists = await Artist.create(
      allResults
    )
    
    await Search.create({
        query: searchQuery, 
        results: artists?
                  artists.map(artist=>artist._id):
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
  console.log("Search and Artist collections emptied")
}
// removeAllSearches()