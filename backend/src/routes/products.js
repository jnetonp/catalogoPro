const express = require('express');
const { body, validationResult } = require('express-validator');
const db = require('../db');
const { authenticateToken, requireAdmin } = require('../middleware/auth');

const router = express.Router();

// GET /api/products - listar com filtros (público)
router.get('/', (req, res) => {
  let products = db.getProducts();
  const { category, minPrice, maxPrice, search, page = 1, limit = 10 } = req.query;

  if (category) {
    products = products.filter(p => p.category.toLowerCase() === category.toLowerCase());
  }
  if (minPrice) {
    products = products.filter(p => p.price >= parseFloat(minPrice));
  }
  if (maxPrice) {
    products = products.filter(p => p.price <= parseFloat(maxPrice));
  }
  if (search) {
    const q = search.toLowerCase();
    products = products.filter(p =>
      p.name.toLowerCase().includes(q) || p.description.toLowerCase().includes(q)
    );
  }

  const total = products.length;
  const start = (parseInt(page) - 1) * parseInt(limit);
  const paginated = products.slice(start, start + parseInt(limit));

  res.json({ data: paginated, total, page: parseInt(page), limit: parseInt(limit) });
});

// GET /api/products/categories - listar categorias únicas (público)
router.get('/categories', (req, res) => {
  const categories = [...new Set(db.getProducts().map(p => p.category))];
  res.json(categories);
});

// GET /api/products/:id - detalhe de produto (público)
router.get('/:id', (req, res) => {
  const product = db.getProductById(parseInt(req.params.id));
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

// POST /api/products - criar produto (admin)
router.post('/', authenticateToken, requireAdmin, [
  body('name').notEmpty().withMessage('Nome obrigatório'),
  body('category').notEmpty().withMessage('Categoria obrigatória'),
  body('price').isFloat({ min: 0 }).withMessage('Preço inválido'),
  body('stock').isInt({ min: 0 }).withMessage('Estoque inválido'),
  body('description').notEmpty().withMessage('Descrição obrigatória')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const product = db.createProduct(req.body);
  res.status(201).json(product);
});

// PUT /api/products/:id - atualizar produto (admin)
router.put('/:id', authenticateToken, requireAdmin, [
  body('price').optional().isFloat({ min: 0 }).withMessage('Preço inválido'),
  body('stock').optional().isInt({ min: 0 }).withMessage('Estoque inválido')
], (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) return res.status(400).json({ errors: errors.array() });

  const product = db.updateProduct(parseInt(req.params.id), req.body);
  if (!product) return res.status(404).json({ error: 'Produto não encontrado' });
  res.json(product);
});

// DELETE /api/products/:id - remover produto (admin)
router.delete('/:id', authenticateToken, requireAdmin, (req, res) => {
  const deleted = db.deleteProduct(parseInt(req.params.id));
  if (!deleted) return res.status(404).json({ error: 'Produto não encontrado' });
  res.status(204).send();
});

module.exports = router;
