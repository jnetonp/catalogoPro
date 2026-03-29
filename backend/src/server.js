require('dotenv').config();
const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const fs = require('fs');
const path = require('path');
const swaggerUi = require('swagger-ui-express');
const YAML = require('yamljs');

const authRoutes = require('./routes/auth');
const productRoutes = require('./routes/products');
const { authenticateToken } = require('./middleware/auth');

const app = express();
const PORT = process.env.PORT || 3001;

// Logs de acesso em arquivo
const accessLogStream = fs.createWriteStream(
  path.join(__dirname, '../logs/access.log'),
  { flags: 'a' }
);

// Middleware
app.use(cors({ origin: process.env.FRONTEND_URL || '*' }));
app.use(express.json());
app.use(morgan('combined', { stream: accessLogStream }));
app.use(morgan('dev'));

// Swagger Docs
try {
  const swaggerDoc = YAML.load(path.join(__dirname, '../swagger.yaml'));
  app.use('/api/docs', swaggerUi.serve, swaggerUi.setup(swaggerDoc));
} catch (e) {
  console.log('Swagger file not found, skipping docs');
}

// Rotas
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);

// Rota pública de health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Handler de erros global
app.use((err, req, res, next) => {
  const errLogStream = fs.createWriteStream(
    path.join(__dirname, '../logs/error.log'),
    { flags: 'a' }
  );
  errLogStream.write(`[${new Date().toISOString()}] ${err.stack}\n`);
  res.status(err.status || 500).json({
    error: err.message || 'Erro interno do servidor'
  });
});

app.listen(PORT, () => {
  console.log(`Servidor rodando na porta ${PORT}`);
});

module.exports = app;
