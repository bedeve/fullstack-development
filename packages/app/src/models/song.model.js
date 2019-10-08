import mongoose from 'mongoose'
const SongSchema = new mongoose.Schema({
  name: {
    type: String,
    trim: true,
    required: 'Name is required'
  },
  image: {
    data: Buffer,
    contentType: String
  },
  url: {
    type: String,
    unique: true
  },
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
})

export default mongoose.model('Song', SongSchema)