import mongoose from 'mongoose'
const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  bandcampUrl: {
    type: String,
  },
  musicbrainzUrl: {
    type: String,
  },
  spotifyUrl: {
    type: String,
  },
  searches: [{type: mongoose.Schema.ObjectId, ref: 'Search'}],
  created: {
    type: Date,
    default: Date.now
  }
})


export default mongoose.model('Artist', ArtistSchema)