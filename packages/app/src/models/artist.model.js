import mongoose from 'mongoose'
const ArtistSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },

  url: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now
  }
})


export default mongoose.model('Artist', ArtistSchema)