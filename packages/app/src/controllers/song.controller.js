import Song from '../models/song.model'
export const search = (req, res) => {
  const searchQuery = req.query.search
  res.json({songs: []})
}