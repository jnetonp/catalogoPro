const request = require('supertest');
const app = require('../src/server');

describe('Health Check', () => {
  it('GET /api/health deve retornar status ok', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.status).toBe('ok');
  });
});

describe('Auth Routes', () => {
  it('POST /api/auth/login com credenciais válidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@catalogo.com', password: 'admin123' });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
  });

  it('POST /api/auth/login com credenciais inválidas', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'nao@existe.com', password: 'errado' });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/auth/login com dados incompletos', async () => {
    const res = await request(app)
      .post('/api/auth/login')
      .send({ email: 'invalido' });
    expect(res.statusCode).toBe(400);
  });
});

describe('Products Routes', () => {
  it('GET /api/products deve retornar lista de produtos', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('data');
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  it('GET /api/products com filtro de categoria', async () => {
    const res = await request(app).get('/api/products?category=Eletrônicos');
    expect(res.statusCode).toBe(200);
    res.body.data.forEach(p => {
      expect(p.category).toBe('Eletrônicos');
    });
  });

  it('GET /api/products/:id existente', async () => {
    const res = await request(app).get('/api/products/1');
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('id', 1);
  });

  it('GET /api/products/:id inexistente', async () => {
    const res = await request(app).get('/api/products/9999');
    expect(res.statusCode).toBe(404);
  });

  it('POST /api/products sem autenticação deve retornar 401', async () => {
    const res = await request(app).post('/api/products').send({
      name: 'Produto Teste',
      category: 'Teste',
      price: 100,
      stock: 10,
      description: 'Desc'
    });
    expect(res.statusCode).toBe(401);
  });

  it('POST /api/products como admin deve criar produto', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'admin@catalogo.com', password: 'admin123' });
    const token = login.body.token;

    const res = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Produto Teste',
        category: 'Teste',
        price: 99.90,
        stock: 5,
        description: 'Produto criado pelo teste'
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('id');
  });
});
