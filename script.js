// Base de datos de productos
const products = [
    {
        id: 1,
        name: "Arduino Uno R3",
        description: "Placa de desarrollo Arduino Uno R3 original con microcontrolador ATmega328P.",
        price: 180,
        category: "arduino",
        image: "https://novatronicec.com/wp-content/uploads/2020/10/uno-dip-3.png",
        stock: 15
    },
    {
        id: 2,
        name: "Sensor Ultrasónico HC-SR04",
        description: "Sensor de distancia ultrasónico para medición de 2cm a 400cm.",
        price: 35,
        category: "sensores",
        image: "https://cdn.awsli.com.br/600x450/244/244633/produto/17800645/4a5cbf2b55.jpg",
        stock: 42
    },
    {
        id: 3,
        name: "Motor DC con Encoder",
        description: "Motor DC de 12V con encoder de 300 RPM para aplicaciones de robótica.",
        price: 95,
        category: "motores",
        image: "https://cdn.awsli.com.br/600x450/244/244633/produto/17852578/42984b75ab.jpg",
        stock: 23
    },
    {
        id: 4,
        name: "Kit de Inicio Arduino",
        description: "Kit completo con Arduino Uno, sensores, LEDs, resistencias y más.",
        price: 420,
        category: "kits",
        image: "https://cdn.awsli.com.br/600x450/244/244633/produto/18485959/2f46077f9a.jpg",
        stock: 8
    },
    {
        id: 5,
        name: "Arduino Mega 2560",
        description: "Placa Arduino Mega con mayor memoria y más pines de E/S.",
        price: 280,
        category: "arduino",
        image: "https://cdn.awsli.com.br/600x450/244/244633/produto/18486308/0ed247257e.jpg",
        stock: 12
    },
    {
        id: 6,
        name: "Sensor de Temperatura DHT22",
        description: "Sensor digital de temperatura y humedad de alta precisión.",
        price: 55,
        category: "sensores",
        image: "https://cdn.awsli.com.br/600x450/244/244633/produto/17800648/1cdb2963a2.jpg",
        stock: 31
    },
    {
        id: 7,
        name: "Servomotor MG996R",
        description: "Servomotor de alta torque y velocidad para brazos robóticos.",
        price: 75,
        category: "motores",
        image: "https://cdn.awsli.com.br/600x450/244/244633/produto/17852579/4ce764ec47.jpg",
        stock: 18
    },
    {
        id: 8,
        name: "Módulo Bluetooth HC-05",
        description: "Módulo Bluetooth para comunicación inalámbrica con Arduino.",
        price: 45,
        category: "otros",
        image: "https://cdn.awsli.com.br/600x450/244/244633/produto/17800647/6eb06e6ba0.jpg",
        stock: 27
    }
];

// Carrito de compras
let cart = [];
const SHIPPING_COST = 15;

// Inicialización al cargar la página
document.addEventListener('DOMContentLoaded', function() {
    renderProducts(products);
    setupEventListeners();
    updateCartCount();
});

// Renderizar productos en el catálogo
function renderProducts(productsToRender) {
    const container = document.getElementById('productsContainer');
    container.innerHTML = '';
    
    if (productsToRender.length === 0) {
        container.innerHTML = `
            <div class="col-12 text-center py-5">
                <i class="fas fa-search fa-3x text-muted mb-3"></i>
                <h4>No se encontraron productos</h4>
                <p class="text-muted">Intenta con otros términos de búsqueda o categorías.</p>
            </div>
        `;
        return;
    }
    
    productsToRender.forEach(product => {
        const productCard = `
            <div class="col-md-6 col-lg-4 col-xl-3 mb-4">
                <div class="card product-card h-100">
                    <img src="${product.image}" class="card-img-top product-img" alt="${product.name}">
                    <div class="card-body d-flex flex-column">
                        <span class="product-category">${getCategoryName(product.category)}</span>
                        <h5 class="product-title">${product.name}</h5>
                        <p class="card-text flex-grow-1">${product.description}</p>
                        <div class="d-flex justify-content-between align-items-center mt-3">
                            <div class="product-price">Bs. ${product.price.toFixed(2)}</div>
                            <div class="text-muted small">Stock: ${product.stock}</div>
                        </div>
                        <button class="btn btn-add-to-cart mt-3" data-id="${product.id}">
                            <i class="fas fa-cart-plus me-2"></i>Añadir al Carrito
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += productCard;
    });
    
    // Añadir event listeners a los botones de carrito
    document.querySelectorAll('.btn-add-to-cart').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            addToCart(productId);
        });
    });
}

// Configurar event listeners
function setupEventListeners() {
    // Buscador
    document.getElementById('searchButton').addEventListener('click', searchProducts);
    document.getElementById('searchInput').addEventListener('keyup', function(event) {
        if (event.key === 'Enter') searchProducts();
    });
    
    // Filtros por categoría
    document.querySelectorAll('.category-btn').forEach(button => {
        button.addEventListener('click', function() {
            // Remover clase active de todos los botones
            document.querySelectorAll('.category-btn').forEach(btn => btn.classList.remove('active'));
            
            // Añadir clase active al botón clickeado
            this.classList.add('active');
            
            // Filtrar productos
            const category = this.getAttribute('data-category');
            filterProductsByCategory(category);
        });
    });
    
    // Carrito
    document.getElementById('cartToggle').addEventListener('click', toggleCart);
    document.getElementById('closeCart').addEventListener('click', toggleCart);
    document.getElementById('cartOverlay').addEventListener('click', toggleCart);
    document.getElementById('clearCartBtn').addEventListener('click', clearCart);
    document.getElementById('checkoutBtn').addEventListener('click', checkout);
}

// Filtrar productos por categoría
function filterProductsByCategory(category) {
    if (category === 'all') {
        renderProducts(products);
    } else {
        const filteredProducts = products.filter(product => product.category === category);
        renderProducts(filteredProducts);
    }
}

// Buscar productos
function searchProducts() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase().trim();
    
    if (searchTerm === '') {
        const activeCategory = document.querySelector('.category-btn.active').getAttribute('data-category');
        filterProductsByCategory(activeCategory);
        return;
    }
    
    const filteredProducts = products.filter(product => 
        product.name.toLowerCase().includes(searchTerm) || 
        product.description.toLowerCase().includes(searchTerm) ||
        getCategoryName(product.category).toLowerCase().includes(searchTerm)
    );
    
    renderProducts(filteredProducts);
}

// Añadir producto al carrito
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    
    if (!product) return;
    
    // Verificar si el producto ya está en el carrito
    const cartItem = cart.find(item => item.id === productId);
    
    if (cartItem) {
        // Verificar stock disponible
        if (cartItem.quantity < product.stock) {
            cartItem.quantity++;
        } else {
            alert(`No hay suficiente stock de ${product.name}. Solo quedan ${product.stock} unidades.`);
            return;
        }
    } else {
        // Añadir nuevo producto al carrito
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1,
            stock: product.stock
        });
    }
    
    updateCart();
    showNotification(`${product.name} añadido al carrito`);
}

// Actualizar carrito
function updateCart() {
    updateCartCount();
    renderCartItems();
    calculateCartTotal();
}

// Actualizar contador del carrito
function updateCartCount() {
    const totalItems = cart.reduce((total, item) => total + item.quantity, 0);
    document.getElementById('cartCount').textContent = totalItems;
}

// Renderizar items del carrito
function renderCartItems() {
    const container = document.getElementById('cartItems');
    const cartSummary = document.getElementById('cartSummary');
    
    if (cart.length === 0) {
        container.innerHTML = '<p class="text-muted text-center" id="emptyCartMessage">Tu carrito está vacío</p>';
        cartSummary.classList.add('d-none');
        return;
    }
    
    cartSummary.classList.remove('d-none');
    container.innerHTML = '';
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        const cartItem = `
            <div class="cart-item">
                <div class="row align-items-center">
                    <div class="col-3">
                        <img src="${item.image}" class="cart-item-img" alt="${item.name}">
                    </div>
                    <div class="col-6">
                        <div class="cart-item-title">${item.name}</div>
                        <div class="small text-muted">Bs. ${item.price.toFixed(2)} c/u</div>
                        <div class="mt-2">
                            <button class="btn btn-sm btn-outline-secondary btn-decrease" data-id="${item.id}">
                                <i class="fas fa-minus"></i>
                            </button>
                            <span class="mx-2">${item.quantity}</span>
                            <button class="btn btn-sm btn-outline-secondary btn-increase" data-id="${item.id}" ${item.quantity >= item.stock ? 'disabled' : ''}>
                                <i class="fas fa-plus"></i>
                            </button>
                        </div>
                    </div>
                    <div class="col-3 text-end">
                        <div class="cart-item-price">Bs. ${itemTotal.toFixed(2)}</div>
                        <button class="btn btn-sm btn-outline-danger mt-2 btn-remove" data-id="${item.id}">
                            <i class="fas fa-trash"></i>
                        </button>
                    </div>
                </div>
            </div>
        `;
        container.innerHTML += cartItem;
    });
    
    // Añadir event listeners a los botones del carrito
    document.querySelectorAll('.btn-increase').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, 1);
        });
    });
    
    document.querySelectorAll('.btn-decrease').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            updateCartItemQuantity(productId, -1);
        });
    });
    
    document.querySelectorAll('.btn-remove').forEach(button => {
        button.addEventListener('click', function() {
            const productId = parseInt(this.getAttribute('data-id'));
            removeFromCart(productId);
        });
    });
}

// Actualizar cantidad de un item en el carrito
function updateCartItemQuantity(productId, change) {
    const cartItem = cart.find(item => item.id === productId);
    
    if (!cartItem) return;
    
    const newQuantity = cartItem.quantity + change;
    
    if (newQuantity < 1) {
        removeFromCart(productId);
        return;
    }
    
    // Verificar stock
    const product = products.find(p => p.id === productId);
    if (newQuantity > product.stock) {
        alert(`No hay suficiente stock de ${product.name}. Solo quedan ${product.stock} unidades.`);
        return;
    }
    
    cartItem.quantity = newQuantity;
    updateCart();
}

// Eliminar producto del carrito
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    updateCart();
}

// Calcular total del carrito
function calculateCartTotal() {
    const subtotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const discount = subtotal > 500 ? subtotal * 0.1 : 0; // 10% de descuento si el subtotal es mayor a 500 Bs.
    const total = subtotal - discount + SHIPPING_COST;
    
    document.getElementById('cartSubtotal').textContent = `Bs. ${subtotal.toFixed(2)}`;
    document.getElementById('cartShipping').textContent = `Bs. ${SHIPPING_COST.toFixed(2)}`;
    document.getElementById('cartDiscount').textContent = `Bs. ${discount.toFixed(2)}`;
    document.getElementById('cartTotal').textContent = `Bs. ${total.toFixed(2)}`;
}

// Mostrar/ocultar carrito
function toggleCart() {
    document.getElementById('cartSidebar').classList.toggle('open');
    document.getElementById('cartOverlay').classList.toggle('show');
}

// Vaciar carrito
function clearCart() {
    if (cart.length === 0) return;
    
    if (confirm('¿Estás seguro de que deseas vaciar el carrito?')) {
        cart = [];
        updateCart();
        showNotification('Carrito vaciado');
    }
}

// Proceder al pago
function checkout() {
    if (cart.length === 0) {
        alert('Tu carrito está vacío');
        return;
    }
    
    // Aquí normalmente se integraría con un gateway de pago
    const total = document.getElementById('cartTotal').textContent;
    
    const paymentMethods = `
        <div class="alert alert-info">
            <h5>Resumen de compra</h5>
            <p>Total a pagar: <strong>${total}</strong></p>
            <hr>
            <h6>Selecciona tu método de pago:</h6>
            <div class="d-grid gap-2 mt-3">
                <button class="btn btn-outline-primary" id="qrPaymentBtn">
                    <i class="fas fa-qrcode me-2"></i>Pago con QR
                </button>
                <button class="btn btn-outline-primary" id="bankTransferBtn">
                    <i class="fas fa-university me-2"></i>Transferencia Bancaria
                </button>
                <button class="btn btn-outline-primary" id="cardPaymentBtn">
                    <i class="fas fa-credit-card me-2"></i>Tarjeta de Crédito/Débito
                </button>
            </div>
        </div>
    `;
    
    // Reemplazar contenido del carrito con opciones de pago
    document.getElementById('cartItems').innerHTML = paymentMethods;
    document.getElementById('cartSummary').classList.add('d-none');
    
    // Añadir event listeners a los botones de pago
    document.getElementById('qrPaymentBtn').addEventListener('click', () => processPayment('QR'));
    document.getElementById('bankTransferBtn').addEventListener('click', () => processPayment('Transferencia Bancaria'));
    document.getElementById('cardPaymentBtn').addEventListener('click', () => processPayment('Tarjeta'));
    
    // Cambiar texto del botón de checkout
    document.getElementById('checkoutBtn').textContent = 'Volver al Carrito';
    document.getElementById('checkoutBtn').removeEventListener('click', checkout);
    document.getElementById('checkoutBtn').addEventListener('click', () => {
        renderCartItems();
        calculateCartTotal();
        document.getElementById('cartSummary').classList.remove('d-none');
        document.getElementById('checkoutBtn').textContent = 'Proceder al Pago';
        document.getElementById('checkoutBtn').removeEventListener('click', () => {});
        document.getElementById('checkoutBtn').addEventListener('click', checkout);
    });
}

// Procesar pago
function processPayment(method) {
    // Simulación de procesamiento de pago
    const total = document.getElementById('cartTotal').textContent;
    
    document.getElementById('cartItems').innerHTML = `
        <div class="alert alert-success text-center">
            <i class="fas fa-check-circle fa-3x text-success mb-3"></i>
            <h5>¡Pago procesado con éxito!</h5>
            <p>Método de pago: <strong>${method}</strong></p>
            <p>Total pagado: <strong>${total}</strong></p>
            <p>Recibirás un correo con los detalles de tu compra.</p>
            <hr>
            <button class="btn btn-primary mt-3" id="continueShoppingBtn">Seguir Comprando</button>
        </div>
    `;
    
    document.getElementById('continueShoppingBtn').addEventListener('click', () => {
        // Vaciar carrito y cerrar
        cart = [];
        updateCart();
        toggleCart();
        
        // Volver a la vista normal del carrito
        renderCartItems();
        calculateCartTotal();
        document.getElementById('cartSummary').classList.remove('d-none');
        document.getElementById('checkoutBtn').textContent = 'Proceder al Pago';
        document.getElementById('checkoutBtn').removeEventListener('click', () => {});
        document.getElementById('checkoutBtn').addEventListener('click', checkout);
    });
}

// Mostrar notificación
function showNotification(message) {
    // Crear elemento de notificación
    const notification = document.createElement('div');
    notification.className = 'alert alert-success position-fixed';
    notification.style.cssText = `
        bottom: 20px;
        right: 20px;
        z-index: 1100;
        min-width: 300px;
        box-shadow: 0 5px 15px rgba(0,0,0,0.1);
    `;
    notification.innerHTML = `
        <div class="d-flex align-items-center">
            <i class="fas fa-check-circle me-2"></i>
            <span>${message}</span>
        </div>
    `;
    
    // Añadir al DOM
    document.body.appendChild(notification);
    
    // Eliminar después de 3 segundos
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Obtener nombre legible de la categoría
function getCategoryName(category) {
    const categories = {
        'arduino': 'Arduino',
        'sensores': 'Sensores',
        'motores': 'Motores',
        'kits': 'Kits',
        'otros': 'Otros Componentes'
    };
    
    return categories[category] || category;
}