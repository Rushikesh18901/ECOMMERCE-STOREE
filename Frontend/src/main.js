import './style.css';

const API_BASE = 'http://127.0.0.1:8000';

let cartItemCount = 0;
let user = null;
let chatOpen = false;
let chatMessages = [];
let chatInput = '';
let chatLoading = false;
let currentCategory = '';
let products = [];
let productList = [];

// State for admin
let isEditing = false;
let editId = null;
let adminForm = {
  name: '',
  description: '',
  price: 0,
  category: 'men',
  image: '',
  size: [],
  color: []
};
let imageFile = null;

function getUser() {
  const storedUser = localStorage.getItem('user');
  if (storedUser) {
    return JSON.parse(storedUser);
  }
  return null;
}

function navigate(path) {
  window.location.hash = path;
}

function router() {
  const hash = window.location.hash || '#/';
  const path = hash.slice(1);
  
  user = getUser();
  
  if (path === '/login') {
    renderLogin();
  } else if (path === '/register') {
    renderRegister();
  } else if (path === '/admin') {
    if (!user || user.role !== 'admin') {
      navigate('#/login');
      return;
    }
    renderAdmin();
  } else if (path.startsWith('/product/')) {
    const id = path.split('/')[2];
    renderProductDetail(id);
  } else {
    if (!user) {
      navigate('#/login');
      return;
    }
    renderHome();
  }
}

function renderHeader() {
  return `
  <header class="header">
    <div class="container header-inner">
      <div class="header-left">
        <button class="menu-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="3" y1="12" x2="21" y2="12"></line><line x1="3" y1="6" x2="21" y2="6"></line><line x1="3" y1="18" x2="21" y2="18"></line></svg>
        </button>
        <h1 class="header-logo">LUXE</h1>
        <nav class="nav">
          <a href="#/home">New Arrivals</a>
          <a href="#/home">Men</a>
          <a href="#/home">Women</a>
          <a href="#/home">Accessories</a>
          <a href="#/home">Sale</a>
        </nav>
      </div>
      <div class="header-right">
        ${user ? `
          <span class="user-email">${user.email}</span>
          ${user.role === 'admin' ? `<a href="#/admin" class="btn btn-primary">Admin</a>` : ''}
          <button id="logoutBtn" class="btn btn-danger">Logout</button>
        ` : `
          <a href="#/login" class="btn btn-outline">Login</a>
          <a href="#/register" class="btn btn-primary">Register</a>
        `}
        <button class="icon-btn">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"></path><circle cx="12" cy="7" r="4"></circle></svg>
        </button>
        <button id="cartBtn" class="icon-btn relative">
          <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><circle cx="9" cy="21" r="1"></circle><circle cx="20" cy="21" r="1"></circle><path d="M1 1h4l2.68 13.39a2 2 0 0 0 2 1.61h9.72a2 2 0 0 0 2-1.61L23 6H6"></path></svg>
          ${cartItemCount > 0 ? `<span class="cart-badge">${cartItemCount}</span>` : ''}
        </button>
      </div>
    </div>
  </header>
`;
}

function renderHero() {
  return `
  <div class="hero">
    <div class="container hero-grid">
      <div class="hero-content">
        <div class="hero-badge">
          <span>New Collection 2026</span>
        </div>
        <h1 class="hero-title">Elevate Your Style with Premium Fashion</h1>
        <p class="hero-desc">Discover our curated collection of timeless pieces that blend sophistication with modern design.</p>
        <div class="hero-actions">
          <button class="btn btn-primary">Shop Now</button>
          <button class="btn btn-outline">View Catalog</button>
        </div>
        <div class="hero-stats">
          <div class="hero-stat">
            <p>500+</p>
            <p>Premium Products</p>
          </div>
          <div class="hero-stat">
            <p>50K+</p>
            <p>Happy Customers</p>
          </div>
          <div class="hero-stat">
            <p>4.9</p>
            <p>Average Rating</p>
          </div>
        </div>
      </div>
      <div class="hero-image-container">
        <div class="hero-image-bg"></div>
        <img src="https://images.pexels.com/photos/1926769/pexels-photo-1926769.jpeg?auto=compress&cs=tinysrgb&w=800" alt="Fashion Model" class="hero-image" />
      </div>
    </div>
    <div class="hero-decoration-1"></div>
    <div class="hero-decoration-2"></div>
  </div>
`;
}

function renderChatbot() {
  return `
  <div class="chatbot-container">
    <button id="chatToggle" class="chatbot-toggle">💬 Chat</button>
    ${chatOpen ? `
    <div class="chatbot-window">
      <div class="chatbot-header">AI Assistant</div>
      <div class="chatbot-messages">
        ${chatLoading ? '<p class="chatbot-typing">🤖 Typing...</p>' : ''}
        ${chatMessages.map(msg => {
          if (msg.sender === 'user') {
            return `
            <div class="message message-user">
              <p>${msg.text}</p>
            </div>
            `;
          } else if (msg.type === 'text') {
            return `
            <div class="message message-bot">
              <p>${msg.message}</p>
            </div>
            `;
          } else if (msg.type === 'products') {
            return `
            <div class="message message-bot">
              ${msg.message ? `<p style="font-size: 0.875rem; color: #6b7280; margin-bottom: 0.5rem;">${msg.message}</p>` : ''}
              ${msg.data && msg.data.length === 0 ? '<p style="font-size: 0.875rem; color: #6b7280;">No products found 😢</p>' : ''}
              ${msg.data && msg.data.length > 0 ? `
              <div class="message-products">
                ${msg.data.map(p => `
                <div class="product-recommendation" data-id="${p._id || p.id}">
                  <img src="${p.image}" alt="${p.name}" />
                  <p>${p.name}</p>
                  <p class="price">₹${p.price}</p>
                </div>
                `).join('')}
              </div>
              ` : ''}
            </div>
            `;
          }
          return '';
        }).join('')}
      </div>
      <div class="chatbot-input">
        <input type="text" id="chatInput" value="${chatInput}" placeholder="Ask about products..." />
        <button id="chatSend">Send</button>
      </div>
    </div>
    ` : ''}
  </div>
`;
}

async function renderHome() {
  // Only fetch if no products loaded or need refresh
  if (products.length === 0 || currentCategory !== '') {
    await fetchProducts(currentCategory);
  }
  
  const categories = ['', 'men', 'women', 'kids'];
  
  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    ${renderHero()}
    <div class="products-section">
      <h2 class="section-title">Our Products</h2>
      <div class="category-buttons" id="category-container">
        <button type="button" class="category-btn" onclick="handleCatClick('')" style="cursor:pointer">All</button>
        <button type="button" class="category-btn" onclick="handleCatClick('men')" style="cursor:pointer">Men</button>
        <button type="button" class="category-btn" onclick="handleCatClick('women')" style="cursor:pointer">Women</button>
        <button type="button" class="category-btn" onclick="handleCatClick('kids')" style="cursor:pointer">Kids</button>
      </div>
      <div class="products-grid">
        ${products.map(p => `
          <div class="product-card" data-id="${p.id}">
            <div class="product-image">
              ${p.image ? `<img src="${p.image}" alt="${p.name}" />` : '<span class="product-placeholder">Product Image</span>'}
            </div>
            <div class="product-info">
              <h3 class="product-name">${p.name}</h3>
              <p class="product-desc">${p.description}</p>
              <div class="product-footer">
                <span class="product-price">₹${p.price}</span>
                <span class="product-category">${p.category}</span>
              </div>
              <button class="add-to-cart-btn" data-id="${p.id}">Add to Cart</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
    ${renderChatbot()}
  `;
  
  setupHomeEvents();
}

async function fetchProducts(category = '') {
  let url = `${API_BASE}/products`;
  if (category) {
    url += `?category=${category}`;
  }
  console.log('Loading from:', url);
  const res = await fetch(url);
  const data = await res.json();
  console.log('Got products:', data.length, 'for category:', category);
  console.log('Sample product:', data[0]);
  products = data;
}

window.filterCategory = async function(category) {
  console.log('filterCategory called with:', category);
  currentCategory = category;
  console.log('currentCategory updated to:', currentCategory);
  await fetchProducts(category);
  renderHome();
};

window.handleCatClick = async function(cat) {
  console.log('handleCatClick:', cat);
  currentCategory = cat;
  await fetchProducts(cat);
  renderHome();
};

function setupHomeEvents() {
  // Update active state on buttons
  document.querySelectorAll('#category-container .category-btn').forEach(btn => {
    btn.classList.remove('active');
  });
  const activeBtn = document.querySelector(`#category-container .category-btn[onclick="handleCatClick('${currentCategory}')"]`);
  if (activeBtn) activeBtn.classList.add('active');
  
  document.querySelectorAll('.product-card').forEach(card => {
    card.addEventListener('click', (e) => {
      if (e.target.classList.contains('add-to-cart-btn')) {
        e.stopPropagation();
        cartItemCount++;
        alert('Added to cart');
        renderHome();
      } else {
        navigate(`#/product/${card.dataset.id}`);
      }
    });
  });
  
  document.getElementById('chatToggle')?.addEventListener('click', () => {
    chatOpen = !chatOpen;
    renderHome();
  });
  
  document.getElementById('chatSend')?.addEventListener('click', handleChatSend);
  
  document.getElementById('chatInput')?.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') handleChatSend();
  });
  
  document.querySelectorAll('.product-recommendation').forEach(el => {
    el.addEventListener('click', () => {
      navigate(`#/product/${el.dataset.id}`);
    });
  });
  
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  document.getElementById('cartBtn')?.addEventListener('click', () => {});
}

function renderLogin() {
  document.getElementById('app').innerHTML = `
    <div class="auth-page">
      <div class="auth-card">
        <div class="auth-tabs">
          <button class="auth-tab active" data-tab="login">Login</button>
          <button class="auth-tab" data-tab="register">Register</button>
        </div>
        
        <div id="loginForm" class="auth-form">
          <h2 class="auth-title">Welcome Back 👋</h2>
          <p id="loginError" class="auth-error"></p>
          <input type="email" id="loginEmail" class="auth-input" placeholder="Enter Email" />
          <input type="password" id="loginPassword" class="auth-input" placeholder="Enter Password" />
          <button id="loginBtn" class="auth-btn">Login</button>
        </div>
        
        <div id="registerForm" class="auth-form" style="display: none;">
          <h2 class="auth-title">Create Account 🚀</h2>
          <p id="regError" class="auth-error"></p>
          <input type="text" id="regName" class="auth-input" placeholder="Enter Name" />
          <input type="email" id="regEmail" class="auth-input" placeholder="Enter Email" />
          <input type="password" id="regPassword" class="auth-input" placeholder="Enter Password" />
          <button id="regBtn" class="auth-btn">Register</button>
        </div>
      </div>
    </div>
  `;
  
  setupAuthEvents();
}

function setupAuthEvents() {
  document.querySelectorAll('.auth-tab').forEach(tab => {
    tab.addEventListener('click', () => {
      document.querySelectorAll('.auth-tab').forEach(t => t.classList.remove('active'));
      tab.classList.add('active');
      
      if (tab.dataset.tab === 'login') {
        document.getElementById('loginForm').style.display = 'block';
        document.getElementById('registerForm').style.display = 'none';
      } else {
        document.getElementById('loginForm').style.display = 'none';
        document.getElementById('registerForm').style.display = 'block';
      }
    });
  });
  
  document.getElementById('loginBtn')?.addEventListener('click', handleLogin);
  document.getElementById('regBtn')?.addEventListener('click', handleRegister);
}

async function handleLogin() {
  const email = document.getElementById('loginEmail').value;
  const password = document.getElementById('loginPassword').value;
  const errorEl = document.getElementById('loginError');
  const btn = document.getElementById('loginBtn');
  
  errorEl.textContent = '';
  btn.textContent = 'Logging in...';
  
  try {
    const res = await fetch(`${API_BASE}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    
    const data = await res.json();
    
    if (data.error) {
      errorEl.textContent = data.error;
      btn.textContent = 'Login';
      return;
    }
    
    localStorage.setItem('user', JSON.stringify(data));
    window.dispatchEvent(new Event('user-login'));
    
    if (data.role === 'admin') {
      navigate('#/admin');
    } else {
      navigate('#/');
    }
  } catch (err) {
    errorEl.textContent = 'Something went wrong. Try again.';
  }
  
  btn.textContent = 'Login';
}

function handleLogout() {
  localStorage.removeItem('user');
  user = null;
  navigate('#/login');
}

function renderRegister() {
  document.getElementById('app').innerHTML = `
    <div class="register-page">
      <h1 class="register-title">Register</h1>
      <input type="text" id="regName" class="register-input" placeholder="Name" />
      <input type="email" id="regEmail" class="register-input" placeholder="Email" />
      <input type="password" id="regPassword" class="register-input" placeholder="Password" />
      <button id="regBtn" class="register-btn">Register</button>
    </div>
  `;
  
  document.getElementById('regBtn')?.addEventListener('click', handleRegister);
}

async function handleRegister() {
  const name = document.getElementById('regName').value;
  const email = document.getElementById('regEmail').value;
  const password = document.getElementById('regPassword').value;
  const errorEl = document.getElementById('regError');
  const btn = document.getElementById('regBtn');
  
  errorEl.textContent = '';
  btn.textContent = 'Registering...';
  
  try {
    const response = await fetch(`${API_BASE}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password }),
    });
    
    const data = await response.json();
    
    if (data.error) {
      errorEl.textContent = data.error;
      btn.textContent = 'Register';
      return;
    }
    
    alert('Registration successful! Please login.');
    document.querySelector('.auth-tab[data-tab="login"]').click();
  } catch (err) {
    errorEl.textContent = 'Something went wrong. Try again.';
  }
  
  btn.textContent = 'Register';
}

async function renderProductDetail(id) {
  const res = await fetch(`${API_BASE}/products`);
  const data = await res.json();
  const product = data.find(p => p.id === id);
  
  if (!product) {
    document.getElementById('app').innerHTML = `
      ${renderHeader()}
      <div class="loading">Loading...</div>
    `;
    return;
  }
  
  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <div class="product-detail">
      <button class="back-btn" onclick="window.history.back()">← Back to Products</button>
      <div class="product-detail-grid">
        <div class="product-detail-image">
          <img src="${product.image || 'https://via.placeholder.com/500x500?text=Product+Image'}" alt="${product.name}" />
        </div>
        <div class="product-detail-info">
          <span class="product-detail-category">${product.category}</span>
          <h1>${product.name}</h1>
          <p class="product-detail-price">₹${product.price}</p>
          <p class="product-detail-desc">${product.description}</p>
          ${product.size && product.size.length > 0 ? `
            <div class="option-group">
              <h3 class="option-label">Sizes:</h3>
              <div class="option-values">
                ${product.size.map(s => `<span class="option-value">${s}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          ${product.color && product.color.length > 0 ? `
            <div class="option-group">
              <h3 class="option-label">Colors:</h3>
              <div class="option-values">
                ${product.color.map(c => `<span class="option-value">${c}</span>`).join('')}
              </div>
            </div>
          ` : ''}
          <div class="detail-actions">
            <button class="detail-btn detail-btn-primary" onclick="alert('Added to cart')">Add to Cart</button>
            <button class="detail-btn detail-btn-secondary">Buy Now</button>
          </div>
        </div>
      </div>
    </div>
  `;
}

async function renderAdmin() {
  await fetchAdminProducts();
  
  document.getElementById('app').innerHTML = `
    ${renderHeader()}
    <div class="admin-page">
      <h1 class="admin-title">Admin Dashboard</h1>
      <div class="admin-form">
        <h2 class="admin-form-title">${isEditing ? 'Edit Product' : 'Add New Product'}</h2>
        <div class="form-grid">
          <input placeholder="Name" class="form-input" id="adminName" value="${adminForm.name}" />
          <input placeholder="Description" class="form-input" id="adminDesc" value="${adminForm.description}" />
          <input placeholder="Price" type="number" class="form-input" id="adminPrice" value="${adminForm.price || ''}" />
          
          <div class="form-col-span">
            <label class="form-label">Category:</label>
            <div class="category-buttons">
              ${['men', 'women', 'kids', 'accessories'].map(cat => `
                <button class="category-btn ${adminForm.category === cat ? 'active' : ''}" data-cat="${cat}">${cat.charAt(0).toUpperCase() + cat.slice(1)}</button>
              `).join('')}
            </div>
          </div>
          
          <div class="form-col-span">
            <label class="form-label">${isEditing ? 'Change Image (optional):' : 'Product Image:'}</label>
            <input type="file" accept="image/png, image/jpeg, image/jpg" id="adminImage" class="form-input" style="width: 100%;" />
            ${adminForm.image && !imageFile ? `<p style="font-size: 0.875rem; color: #6b7280; margin-top: 0.5rem;">Current image: ${adminForm.image}</p>` : ''}
          </div>
          
          <div class="form-col-span">
            <label class="form-label">Select Sizes:</label>
            <div class="checkbox-group">
              ${['S', 'M', 'L', 'XL', 'XXL'].map(size => `
                <label class="checkbox-label">
                  <input type="checkbox" ${adminForm.size?.includes(size) ? 'checked' : ''} data-size="${size}" />
                  <span>${size}</span>
                </label>
              `).join('')}
            </div>
          </div>
          
          <div class="form-col-span">
            <label class="form-label">Color:</label>
            <input placeholder="Enter color (e.g., Black, Blue, Red)" class="form-input" style="width: 100%;" id="adminColor" value="${Array.isArray(adminForm.color) ? adminForm.color.join(', ') : adminForm.color || ''}" />
          </div>
        </div>
        
        <div class="form-actions">
          ${isEditing ? `
            <button id="updateProduct" class="btn btn-blue">Update Product</button>
            <button id="cancelEdit" class="btn btn-outline">Cancel</button>
          ` : `
            <button id="addProduct" class="btn btn-success">Add Product</button>
          `}
        </div>
      </div>
      
      <h2 class="product-list-title">Product List</h2>
      <div class="product-list-grid">
        ${productList.map(p => `
          <div class="product-list-item">
            <img src="${p.image}" alt="${p.name}" />
            <h3>${p.name}</h3>
            <p>${p.description}</p>
            <p class="price">₹${p.price}</p>
            <p class="meta">Category: ${p.category}</p>
            <p class="meta">Sizes: ${p.size?.join(', ') || 'N/A'}</p>
            <div class="product-actions">
              <button class="edit-btn" data-id="${p._id}">Edit</button>
              <button class="delete-btn" data-id="${p._id}">Delete</button>
            </div>
          </div>
        `).join('')}
      </div>
    </div>
  `;
  
  setupAdminEvents();
}

async function fetchAdminProducts() {
  const res = await fetch(`${API_BASE}/products`);
  productList = await res.json();
}

function setupAdminEvents() {
  document.getElementById('logoutBtn')?.addEventListener('click', handleLogout);
  
  document.querySelectorAll('[data-cat]').forEach(btn => {
    btn.addEventListener('click', () => {
      adminForm.category = btn.dataset.cat;
      renderAdmin();
    });
  });
  
  document.querySelectorAll('[data-size]').forEach(cb => {
    cb.addEventListener('change', () => {
      const size = cb.dataset.size;
      const currentSizes = adminForm.size || [];
      if (cb.checked) {
        adminForm.size = [...currentSizes, size];
      } else {
        adminForm.size = currentSizes.filter(s => s !== size);
      }
    });
  });
  
  document.getElementById('addProduct')?.addEventListener('click', handleAddProduct);
  
  document.getElementById('updateProduct')?.addEventListener('click', handleUpdateProduct);
  
  document.getElementById('cancelEdit')?.addEventListener('click', () => {
    resetAdminForm();
    renderAdmin();
  });
  
  document.querySelectorAll('.edit-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const product = productList.find(p => p._id === btn.dataset.id);
      editProduct(product);
    });
  });
  
  document.querySelectorAll('.delete-btn').forEach(btn => {
    btn.addEventListener('click', () => deleteProduct(btn.dataset.id));
  });
  
  document.getElementById('adminImage')?.addEventListener('change', (e) => {
    imageFile = e.target.files?.[0] || null;
  });
}

async function handleAddProduct() {
  adminForm.name = document.getElementById('adminName').value;
  adminForm.description = document.getElementById('adminDesc').value;
  adminForm.price = Number(document.getElementById('adminPrice').value);
  adminForm.color = document.getElementById('adminColor').value.split(',').map(c => c.trim()).filter(c => c);
  
  if (!adminForm.name || !adminForm.description || !adminForm.price || !adminForm.category) {
    alert('Please fill in all fields');
    return;
  }
  
  const formData = new FormData();
  formData.append('name', adminForm.name);
  formData.append('description', adminForm.description);
  formData.append('price', String(adminForm.price));
  formData.append('category', adminForm.category);
  formData.append('size', adminForm.size?.join(',') || 'M,L');
  formData.append('color', adminForm.color?.join(', ') || 'Black');
  if (imageFile) formData.append('image', imageFile);
  
  await fetch(`${API_BASE}/products`, { method: 'POST', body: formData });
  alert('Product Added ✅');
  resetAdminForm();
  renderAdmin();
}

async function handleUpdateProduct() {
  adminForm.name = document.getElementById('adminName').value;
  adminForm.description = document.getElementById('adminDesc').value;
  adminForm.price = Number(document.getElementById('adminPrice').value);
  adminForm.color = document.getElementById('adminColor').value.split(',').map(c => c.trim()).filter(c => c);
  
  if (!adminForm.name || !adminForm.description || !adminForm.price || !adminForm.category) {
    alert('Please fill in all fields');
    return;
  }
  
  if (imageFile) {
    const formData = new FormData();
    formData.append('name', adminForm.name);
    formData.append('description', adminForm.description);
    formData.append('price', String(adminForm.price));
    formData.append('category', adminForm.category);
    formData.append('size', adminForm.size?.join(',') || 'M,L');
    formData.append('color', adminForm.color?.join(', ') || 'Black');
    formData.append('image', imageFile);
    await fetch(`${API_BASE}/products/${editId}`, { method: 'PUT', body: formData });
  } else {
    await fetch(`${API_BASE}/products/${editId}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ ...adminForm, size: adminForm.size || ['M', 'L'], color: adminForm.color || ['Black'] })
    });
  }
  
  alert('Product Updated ✅');
  resetAdminForm();
  renderAdmin();
}

async function deleteProduct(id) {
  await fetch(`${API_BASE}/products/${id}`, { method: 'DELETE' });
  productList = productList.filter(p => p._id !== id);
  renderAdmin();
}

function editProduct(product) {
  isEditing = true;
  editId = product._id;
  imageFile = null;
  const colorValue = product.color ? (typeof product.color === 'string' ? product.color.split(',').map(c => c.trim()) : product.color) : [];
  adminForm = {
    name: product.name,
    description: product.description,
    price: product.price,
    category: product.category,
    image: product.image,
    size: product.size || [],
    color: colorValue
  };
  renderAdmin();
}

function resetAdminForm() {
  isEditing = false;
  editId = null;
  imageFile = null;
  adminForm = {
    name: '',
    description: '',
    price: 0,
    category: 'men',
    image: '',
    size: [],
    color: []
  };
}

async function handleChatSend() {
  const input = document.getElementById('chatInput');
  chatInput = input.value;
  
  if (!chatInput) return;
  
  chatMessages = [...chatMessages, { sender: 'user', text: chatInput }];
  chatLoading = true;
  
  const currentMessages = [...chatMessages];
  
  const res = await fetch(`${API_BASE}/chat`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ message: chatInput }),
  });
  
  const data = await res.json();
  chatLoading = false;
  
  chatMessages = [...currentMessages, {
    sender: 'bot',
    type: data.type,
    data: data.data,
    message: data.message
  }];
  
  chatInput = '';
  renderHome();
}

window.addEventListener('hashchange', router);

window.addEventListener('DOMContentLoaded', () => {
  const checkUser = () => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      user = JSON.parse(storedUser);
    }
  };
  
  checkUser();
  
  window.addEventListener('storage', (e) => {
    if (e.key === 'user') {
      checkUser();
      router();
    }
  });
  
  window.addEventListener('user-login', () => {
    checkUser();
    router();
  });
  
  router();
});

export {};