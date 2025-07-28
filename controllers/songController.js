const Song = require('../models/Song');

exports.getSongs = async (req, res) => {
  const songs = await Song.find();
  res.json(songs);
};

exports.createSong = async (req, res) => {
  const { name, path, plays } = req.body;
  const song = new Song({ name, path, plays });
  await song.save();
  res.status(201).json(song);
};

exports.updateSong = async (req, res) => {
  const { id } = req.params;
  const song = await Song.findByIdAndUpdate(id, req.body, { new: true });
  res.json(song);
};

exports.deleteSong = async (req, res) => {
  const { id } = req.params;
  await Song.findByIdAndDelete(id);
  res.json({ message: 'Canción eliminada' });
};
