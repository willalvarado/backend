require('dotenv').config();
const express = require('express');
const cors = require('cors');
const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

// Rutas
const songRoutes = require('./routes/songRoutes');
app.use('/api', songRoutes);

// Servidor
app.listen(process.env.PORT, () =>
  console.log(`🚀 Servidor corriendo en http://localhost:${process.env.PORT}`)
);
