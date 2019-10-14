import mongoose from 'mongoose'
const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  image: {
    type: String
  },
  url: {
    type: String,
  },
  created: {
    type: Date,
    default: Date.now
  }
})


export default mongoose.model('Song', SongSchema)