// Simulação de banco de dados em memória
// Em produção, substituir pelo serviço gerenciado (Supabase, MongoDB Atlas, etc.)

const bcrypt = require('bcryptjs');

// Gera hashes na inicialização para garantir compatibilidade
const adminHash = bcrypt.hashSync('admin123', 10);
const userHash = bcrypt.hashSync('user123', 10);

let users = [
  {
    id: 1,
    name: 'Admin',
    email: 'admin@catalogo.com',
    password: adminHash,
    role: 'admin'
  },
  {
    id: 2,
    name: 'Usuário Teste',
    email: 'user@catalogo.com',
    password: userHash,
    role: 'user'
  }
];

let products = [
  { id: 1, name: 'Notebook Pro 15"', category: 'Eletrônicos', price: 3599.99, stock: 12, description: 'Notebook de alta performance com 16GB RAM', imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400' },
  { id: 2, name: 'Mouse Gamer RGB', category: 'Periféricos', price: 189.90, stock: 35, description: 'Mouse gamer com 7 botões programáveis', imageUrl: 'https://images.unsplash.com/photo-1527814050087-3793815479db?w=400' },
  { id: 3, name: 'Teclado Mecânico', category: 'Periféricos', price: 349.00, stock: 20, description: 'Teclado mecânico switch blue com LED', imageUrl: 'https://images.unsplash.com/photo-1541140532154-b024d705b90a?w=400' },
  { id: 4, name: 'Monitor 27" 4K', category: 'Eletrônicos', price: 2199.00, stock: 8, description: 'Monitor 4K IPS com 144Hz', imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400' },
  { id: 5, name: 'Headset Wireless', category: 'Áudio', price: 599.90, stock: 18, description: 'Headset sem fio com cancelamento de ruído', imageUrl: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400' },
  { id: 6, name: 'Webcam Full HD', category: 'Periféricos', price: 279.00, stock: 25, description: 'Webcam 1080p com microfone integrado', imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400' },
  { id: 7, name: 'SSD 1TB NVMe', category: 'Armazenamento', price: 459.00, stock: 40, description: 'SSD NVMe com velocidade de 3500 MB/s', imageUrl: 'https://images.unsplash.com/photo-1531492746076-161ca9bcad58?w=400' },
  { id: 8, name: 'Placa de Vídeo RTX', category: 'Eletrônicos', price: 4299.00, stock: 5, description: 'GPU de última geração para gaming e criação', imageUrl: 'https://images.unsplash.com/photo-1591488320449-011701bb6704?w=400' }
];

let nextUserId = 3;
let nextProductId = 9;

module.exports = {
  getUsers: () => users,
  getUserByEmail: (email) => users.find(u => u.email === email),
  getUserById: (id) => users.find(u => u.id === id),
  createUser: (userData) => {
    const user = { id: nextUserId++, ...userData };
    users.push(user);
    return user;
  },

  getProducts: () => products,
  getProductById: (id) => products.find(p => p.id === id),
  createProduct: (data) => {
    const product = { id: nextProductId++, ...data };
    products.push(product);
    return product;
  },
  updateProduct: (id, data) => {
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return null;
    products[idx] = { ...products[idx], ...data };
    return products[idx];
  },
  deleteProduct: (id) => {
    const idx = products.findIndex(p => p.id === id);
    if (idx === -1) return false;
    products.splice(idx, 1);
    return true;
  }
};
