import mongoose from 'mongoose'
const SearchSchema = new mongoose.Schema({
  query: {
    type: String,
    trim: true,
    lowercase: true,
    required: 'Query is required'
  },
  results: [{type: mongoose.Schema.ObjectId, ref: 'Song'}],
  updated: Date,
  created: {
    type: Date,
    default: Date.now
  },
})

export default mongoose.model('Search', SearchSchema)