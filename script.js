// Products Data
const products = [
    {
        id: 1,
        name: 'بانر 150 Members',
        description: 'تصميم بانر احترافي للاحتفال بوصول 150 عضو',
        price: 30,
        image: 'images/product1.png'
    },
    {
        id: 2,
        name: 'بانر Season 2',
        description: 'تصميم بانر الموسم الثاني لسيرفرك',
        price: 30,
        image: 'images/product2.png'
    },
    {
        id: 3,
        name: 'بانر Staff Apply',
        description: 'تصميم بانر التقديم على الإدارة',
        price: 30,
        image: 'images/product3.png'
    },
    {
        id: 4,
        name: 'بانر Rules',
        description: 'تصميم بانر قوانين السيرفر',
        price: 30,
        image: 'images/product4.png'
    },
    {
        id: 5,
        name: 'تصميم لوجو احترافي',
        description: 'تصميم شعار احترافي لعلامتك التجارية',
        price: 30,
        icon: 'fa-pen-nib'
    },
    {
        id: 6,
        name: 'تصميم بوست سوشيال ميديا',
        description: 'تصاميم جذابة لمنصات التواصل الاجتماعي',
        price: 30,
        icon: 'fa-share-nodes'
    }
];

// Load cart from localStorage
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Save cart to localStorage
function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}

// Load Products
function loadProducts() {
    const productsGrid = document.getElementById('productsGrid');
    productsGrid.innerHTML = '';

    products.forEach(product => {
        const productCard = document.createElement('div');
        productCard.className = 'product-card';
        productCard.innerHTML = `
            <div class="product-image">
                ${product.image ? `<img src="${product.image}" alt="${product.name}" style="width: 100%; height: 100%; object-fit: cover;">` : `<i class="fas ${product.icon}"></i>`}
            </div>
            <div class="product-info">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <div class="product-price">${product.price} ج</div>
                <button class="add-to-cart" onclick="addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i>
                    أضف للسلة
                </button>
            </div>
        `;
        productsGrid.appendChild(productCard);
    });
}

// Add to Cart
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity++;
    } else {
        cart.push({ ...product, quantity: 1 });
    }

    saveCart();
    updateCartCount();
    showNotification('تم إضافة المنتج للسلة');
}

// Update Cart Count
function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;
}

// Show Notification
function showNotification(message) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: var(--primary-blue);
        color: white;
        padding: 15px 25px;
        border-radius: 8px;
        z-index: 3000;
        animation: slideIn 0.3s ease;
    `;
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Cart Modal
const modal = document.getElementById('cartModal');
const cartIcon = document.querySelector('.cart-icon');
const closeBtn = document.querySelector('.close');

cartIcon.onclick = function () {
    modal.style.display = 'block';
    displayCart();
}

closeBtn.onclick = function () {
    modal.style.display = 'none';
}

window.onclick = function (event) {
    if (event.target == modal) {
        modal.style.display = 'none';
    }
}

// Display Cart
function displayCart() {
    const cartItems = document.getElementById('cartItems');
    const totalPrice = document.getElementById('totalPrice');

    if (cart.length === 0) {
        cartItems.innerHTML = '<p style="text-align: center; color: var(--text-gray);">السلة فارغة</p>';
        totalPrice.textContent = '0';
        return;
    }

    cartItems.innerHTML = '';
    let total = 0;

    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;

        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div>
                <h4>${item.name}</h4>
                <p>السعر: ${item.price} ج × ${item.quantity}</p>
            </div>
            <div style="display: flex; align-items: center; gap: 15px;">
                <span style="font-size: 18px; font-weight: bold; color: var(--primary-blue);">${itemTotal} ج</span>
                <button onclick="removeFromCart(${item.id})" style="background: #ff4444; color: white; border: none; padding: 8px 15px; border-radius: 5px; cursor: pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        `;
        cartItems.appendChild(cartItem);
    });

    totalPrice.textContent = total;
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    saveCart();
    updateCartCount();
    displayCart();
    showNotification('تم حذف المنتج من السلة');
}

// Checkout
document.getElementById('checkoutBtn').onclick = function () {
    if (cart.length === 0) {
        showNotification('السلة فارغة');
        return;
    }

    // إنشاء رسالة الطلب
    let orderMessage = '🛒 طلب جديد من الموقع\n\n';
    let total = 0;

    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        orderMessage += `${index + 1}. ${item.name}\n`;
        orderMessage += `   الكمية: ${item.quantity}\n`;
        orderMessage += `   السعر: ${itemTotal} ج\n\n`;
    });

    orderMessage += `💰 المجموع الكلي: ${total} ج`;

    // نسخ الرسالة وإظهار نافذة التعليمات
    navigator.clipboard.writeText(orderMessage).then(() => {
        showDiscordInstructions();
        cart = [];
        saveCart();
        updateCartCount();
        modal.style.display = 'none';
    });
}

// نافذة تعليمات الديسكورد
function showDiscordInstructions() {
    const instructionModal = document.createElement('div');
    instructionModal.className = 'instruction-modal';
    instructionModal.innerHTML = `
        <div class="instruction-content">
            <div class="instruction-icon">
                <i class="fab fa-discord"></i>
            </div>
            <h2>تم نسخ تفاصيل طلبك بنجاح!</h2>
            <p class="instruction-subtitle">لإتمام عملية الشراء، يرجى اتباع الخطوات التالية:</p>
            
            <div class="instruction-steps">
                <div class="step">
                    <div class="step-number">1</div>
                    <div class="step-content">
                        <h3>انضم لسيرفر الديسكورد</h3>
                        <p>اضغط على الزر بالأسفل للدخول إلى السيرفر</p>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">2</div>
                    <div class="step-content">
                        <h3>افتح تذكرة جديدة</h3>
                        <p>ابحث عن قسم التذاكر وقم بفتح تذكرة</p>
                    </div>
                </div>
                
                <div class="step">
                    <div class="step-number">3</div>
                    <div class="step-content">
                        <h3>الصق تفاصيل الطلب</h3>
                        <p>تم نسخ تفاصيل طلبك، قم بلصقها في التذكرة</p>
                    </div>
                </div>
            </div>
            
            <div class="instruction-buttons">
                <a href="https://discord.gg/yourserver" target="_blank" class="btn-discord-join">
                    <i class="fab fa-discord"></i>
                    <span>انضم للسيرفر الآن</span>
                </a>
                <button class="btn-close-instruction" onclick="closeInstructionModal()">
                    <i class="fas fa-check"></i>
                    <span>فهمت</span>
                </button>
            </div>
        </div>
    `;
    document.body.appendChild(instructionModal);
}

// إغلاق نافذة التعليمات
function closeInstructionModal() {
    const instructionModal = document.querySelector('.instruction-modal');
    if (instructionModal) {
        instructionModal.remove();
    }
}


// Contact Form
document.getElementById('contactForm').onsubmit = function (e) {
    e.preventDefault();
    showNotification('تم إرسال رسالتك بنجاح');
    this.reset();
}

// Smooth Scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Active Nav Link
window.addEventListener('scroll', () => {
    const sections = document.querySelectorAll('section');
    const navLinks = document.querySelectorAll('.nav-links a');

    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
});

// Initialize
loadProducts();
updateCartCount();
