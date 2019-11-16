import Artist from '../models/artist.model'
import {searchBandCamp} from "../scrapers/bandcamp"
import {searchMusicBrainz} from "../scrapers/musicbrainz"
import {searchSpotify} from "../scrapers/spotify"


export const search = async (req, res) => {
  const searchQuery = req.query.search_query.toLowerCase()

  const cachedResultsCount = await Artist.countDocuments({ // check the deprecation warning
    name: searchQuery
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
    console.log(bandcampResults, musicbrainzResults)
    const artistDocument = {
      name: searchQuery,
      bandcampUrl: bandcampResults[0].url,
      musicbrainzUrl: musicbrainzResults[0].url,
      searches: storedSearch
    }
    const artist = await Artist.create(
      artistDocument
    )

    res.json(artist)  
  }
  // const storedArtist = await Artist.findOne({
  //   name: searchQuery
  // }).populate(
  //   "results", "name url"
  // )
  //   const allResults = musicbrainzResults.concat(bandcampResults)
    
  //   await Search.create({
  //       query: searchQuery, 
  //       results: artists?
  //                 artists.map(artist=>artist._id):
  //                 [] 
  //   })
  // } 

  // res.json(storedSearch)
}

const removeAllSearches = async () => {
  await Search.deleteMany({})
  await Song.deleteMany({})
  console.log("Search and Artist collections emptied")
}
// removeAllSearches()