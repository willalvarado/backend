const express = require('express');
const router = express.Router();
const pool = require('../db'); // o la ruta que uses

// Obtener todas las canciones
router.get('/songs', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM songs ORDER BY id ASC');
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Obtener canción por id
router.get('/songs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('SELECT * FROM songs WHERE id = $1', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Canción no encontrada' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Crear canción
router.post('/songs', async (req, res) => {
  const { name, artist, album, year, path, plays } = req.body;

  if (!name || !artist || !path) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (name, artist, path)' });
  }

  const safePlays = plays === undefined || isNaN(parseInt(plays)) ? 0 : parseInt(plays);
  const safeYear = year === undefined || isNaN(parseInt(year)) ? null : parseInt(year);

  try {
    const result = await pool.query(
      `INSERT INTO songs (name, artist, album, year, path, plays)
       VALUES ($1, $2, $3, $4, $5, $6) RETURNING *`,
      [name, artist, album || null, safeYear, path, safePlays]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Actualizar canción
router.put('/songs/:id', async (req, res) => {
  const { id } = req.params;
  const { name, artist, album, year, path, plays } = req.body;

  if (!name || !artist || !path) {
    return res.status(400).json({ error: 'Faltan campos obligatorios (name, artist, path)' });
  }

  const safePlays = plays === undefined || isNaN(parseInt(plays)) ? 0 : parseInt(plays);
  const safeYear = year === undefined || isNaN(parseInt(year)) ? null : parseInt(year);

  try {
    const result = await pool.query(
      `UPDATE songs
       SET name=$1, artist=$2, album=$3, year=$4, path=$5, plays=$6
       WHERE id=$7 RETURNING *`,
      [name, artist, album || null, safeYear, path, safePlays, id]
    );
    if (result.rows.length === 0) return res.status(404).json({ error: 'Canción no encontrada para actualizar' });
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

// Eliminar canción
router.delete('/songs/:id', async (req, res) => {
  const { id } = req.params;
  try {
    const result = await pool.query('DELETE FROM songs WHERE id = $1 RETURNING *', [id]);
    if (result.rows.length === 0) return res.status(404).json({ error: 'Canción no encontrada para eliminar' });
    res.json({ message: 'Canción eliminada correctamente', song: result.rows[0] });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
});

module.exports = router;
