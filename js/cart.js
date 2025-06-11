// DOM Elements
const cartToggleIcon = document.querySelector('.cart'); // Icon mở giỏ hàng
const modalCart = document.querySelector('.modal_cart'); // Modal giỏ hàng
const closeCartButton = document.querySelector('.shopping__close'); // Nút đóng giỏ hàng
const cartQuantityBadge = document.querySelector('.cart_num'); // Số lượng sản phẩm trong giỏ hàng
const allDishItems = document.querySelectorAll(".dish__item"); // Tất cả các sản phẩm trên trang
const addCartButtons = document.querySelectorAll(".add__card"); // Tất cả các nút "Thêm vào giỏ"
const shoppingListUL = document.querySelector('.shopping__list'); // Danh sách ul chứa các sản phẩm trong giỏ hàng
const shoppingCartTotalElement = document.querySelector('.shopping__cart__total'); // Element hiển thị tổng tiền

// Khởi tạo danh sách sản phẩm từ DOM
const productListFromDOM = [];
allDishItems.forEach((dishItem, index) => {
    const image = dishItem.querySelector(".img img").src;
    const name = dishItem.querySelector(".item_name").textContent.trim();
    const priceString = dishItem.querySelector(".item_price").textContent.trim().replace(/\./g, ''); // Loại bỏ dấu chấm nếu có (ví dụ: 290.000 -> 290000)
    const price = parseFloat(priceString);

    productListFromDOM.push({
        id: index,
        image: image,
        name: name,
        price: price, // Lưu giá dưới dạng số
    });
});

// console.log("Danh sách sản phẩm từ DOM:", productListFromDOM);

// Event Listeners cho việc mở/đóng giỏ hàng
if (cartToggleIcon) {
    cartToggleIcon.addEventListener('click', () => {
        if (modalCart) modalCart.classList.add('active_cart');
    });
}

if (closeCartButton) {
    closeCartButton.addEventListener('click', () => {
        if (modalCart) modalCart.classList.remove('active_cart');
    });
}

// Event Listeners cho các nút "Thêm vào giỏ"
addCartButtons.forEach((button, index) => {
    button.addEventListener('click', () => {
        const product = productListFromDOM[index];
        if (product) {
            addItemToCart(product.image, product.name, product.price);
        }
    });
});

/**
 * Thêm sản phẩm vào giỏ hàng.
 * @param {string} img - URL hình ảnh sản phẩm.
 * @param {string} name - Tên sản phẩm.
 * @param {number} price - Giá sản phẩm.
 */
function addItemToCart(img, name, price) {
    const existingCartItems = shoppingListUL.querySelectorAll('li');
    for (let i = 0; i < existingCartItems.length; i++) {
        const itemNameElement = existingCartItems[i].querySelector('.shopping__item__name h3');
        if (itemNameElement && itemNameElement.innerText === name) {
            // Sử dụng một modal tùy chỉnh thay vì alert()
            showCustomAlert('Sản phẩm của bạn đã có trong giỏ hàng.');
            return;
        }
    }

    const listItem = document.createElement('li');
    listItem.innerHTML = ` 
        <div style="margin-bottom:16px;">
            <div class="row align-items-center">
                <div class="col-3">
                    <img class="shopping__item__img" src="${img}" alt="${name}" style="width: 100%; height: auto; max-height: 100px; border-radius:6px; object-fit: cover;">
                </div>
                <div class="col-7">
                    <div class="shopping__item__content">
                        <span class="shopping__item__name" style="display: block;">
                            <h3 style="font-size: 16px; margin: 0 0 5px 0; color: #fff; line-height: 1.2;">${name}</h3>
                        </span>
                        <div style="display: flex; justify-content: space-between; align-items: center;">
                            <input class="shopping__item__input form-control form-control-sm" type="number" value="1" min="1" style="font-size: 16px; width: 50px; height: 28px; background-color: rgba(255,255,255,0.1); color: #fff; border: 1px solid rgba(255,255,255,0.2);">
                            <span class="shopping__item__price" style="color: #fff; font-size: 16px; white-space: nowrap;">${price.toLocaleString('vi-VN')} VND</span>
                        </div>
                    </div>
                </div>
                <div class="col-2 text-end">
                    <button class="delete btn btn-danger btn-sm" style="font-size: 12px; padding: 5px 8px;">Xóa</button>
                </div>
            </div>
        </div>
    `;
    shoppingListUL.appendChild(listItem);

    updateCartState(); // Cập nhật tổng tiền, số lượng, lưu localStorage và gán sự kiện
}

/**
 * Cập nhật tổng tiền của giỏ hàng.
 */
function updateCartTotal() {
    let total = 0;
    const cartItems = shoppingListUL.querySelectorAll('li');
    cartItems.forEach(item => {
        const priceString = item.querySelector('.shopping__item__price').textContent.replace(/[^\d]/g, ''); // Lấy phần số từ chuỗi giá (loại bỏ VND và dấu phẩy)
        const price = parseFloat(priceString);
        const quantity = parseInt(item.querySelector('.shopping__item__input').value);
        if (!isNaN(price) && !isNaN(quantity)) {
            total += price * quantity;
        }
    });
    if (shoppingCartTotalElement) {
         // Định dạng tổng tiền sang VND và thêm đơn vị
        shoppingCartTotalElement.innerHTML = `${total.toLocaleString('vi-VN')} <span>VND</span>`;
    }
}

/**
 * Gán sự kiện xóa cho các sản phẩm trong giỏ hàng.
 */
function setupDeleteButtons() {
    const deleteButtons = shoppingListUL.querySelectorAll('.delete');
    deleteButtons.forEach(button => {
        // Xóa event listener cũ để tránh gắn nhiều lần
        button.removeEventListener('click', handleDeleteItem);
        button.addEventListener('click', handleDeleteItem);
    });
}

/**
 * Xử lý việc xóa một sản phẩm khỏi giỏ hàng.
 * @param {Event} event - Sự kiện click.
 */
function handleDeleteItem(event) {
    const buttonClicked = event.currentTarget;
    // Tìm phần tử li cha gần nhất và xóa nó
    const listItem = buttonClicked.closest('li');
    if (listItem) {
        listItem.remove();
        updateCartState();
    }
}


/**
 * Gán sự kiện thay đổi số lượng cho các sản phẩm trong giỏ hàng.
 */
function setupQuantityInputs() {
    const quantityInputs = shoppingListUL.querySelectorAll('.shopping__item__input');
    quantityInputs.forEach(input => {
        // Xóa event listener cũ
        input.removeEventListener('change', handleQuantityChange);
        input.addEventListener('change', handleQuantityChange);
    });
}

/**
 * Xử lý việc thay đổi số lượng sản phẩm.
 * @param {Event} event - Sự kiện change.
 */
function handleQuantityChange(event) {
    const inputChanged = event.currentTarget;
    if (parseInt(inputChanged.value) < 1) {
        inputChanged.value = '1'; // Đảm bảo số lượng không nhỏ hơn 1
    }
    updateCartState();
}

/**
 * Cập nhật số lượng hiển thị trên badge của giỏ hàng.
 */
function updateCartQuantityBadge() {
    if (cartQuantityBadge) {
        const itemCount = shoppingListUL.querySelectorAll('li').length;
        cartQuantityBadge.innerText = itemCount;
    }
}

/**
 * Lưu trạng thái hiện tại của giỏ hàng vào localStorage.
 */
function saveCartToLocalStorage() {
    if (shoppingListUL) {
        localStorage.setItem('shopping_cart_items', shoppingListUL.innerHTML);
    }
    if (shoppingCartTotalElement) {
        localStorage.setItem('shopping_cart_total', shoppingCartTotalElement.innerHTML);
    }
    if (cartQuantityBadge) {
        localStorage.setItem('shopping_cart_quantity', cartQuantityBadge.innerText);
    }
}

/**
 * Tải trạng thái giỏ hàng từ localStorage khi trang được load.
 */
function loadCartFromLocalStorage() {
    const savedItemsHTML = localStorage.getItem('shopping_cart_items');
    const savedTotalHTML = localStorage.getItem('shopping_cart_total');
    const savedQuantity = localStorage.getItem('shopping_cart_quantity');

    if (savedItemsHTML && shoppingListUL) {
        shoppingListUL.innerHTML = savedItemsHTML;
    }
    if (savedTotalHTML && shoppingCartTotalElement) {
        shoppingCartTotalElement.innerHTML = savedTotalHTML;
    }
    if (savedQuantity && cartQuantityBadge) {
        cartQuantityBadge.innerText = savedQuantity;
    }
    
    // Sau khi tải xong, cần gán lại các event listeners
    updateCartState(false); // false để không lưu lại localStorage ngay lập tức
}

/**
 * Hàm tổng hợp để cập nhật toàn bộ trạng thái giỏ hàng và gán lại sự kiện.
 * @param {boolean} save - Mặc định là true, có lưu vào localStorage hay không.
 */
function updateCartState(save = true) {
    updateCartTotal();
    updateCartQuantityBadge();
    setupDeleteButtons();
    setupQuantityInputs();
    if (save) {
        saveCartToLocalStorage();
    }
}

/**
 * Hiển thị một thông báo tùy chỉnh.
 * @param {string} message - Nội dung thông báo.
 */
function showCustomAlert(message) {
    // Tạo phần tử cho modal alert
    const alertModal = document.createElement('div');
    alertModal.style.position = 'fixed';
    alertModal.style.top = '0';
    alertModal.style.left = '0';
    alertModal.style.width = '100%';
    alertModal.style.height = '100%';
    alertModal.style.backgroundColor = 'rgba(0,0,0,0.5)';
    alertModal.style.display = 'flex';
    alertModal.style.justifyContent = 'center';
    alertModal.style.alignItems = 'center';
    alertModal.style.zIndex = '10000'; // Đảm bảo nó ở trên cùng

    const alertContent = document.createElement('div');
    alertContent.style.backgroundColor = '#fff';
    alertContent.style.padding = '30px';
    alertContent.style.borderRadius = '8px';
    alertContent.style.textAlign = 'center';
    alertContent.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    alertContent.style.maxWidth = '300px';


    const alertMessage = document.createElement('p');
    alertMessage.textContent = message;
    alertMessage.style.fontSize = '16px';
    alertMessage.style.color = '#333';
    alertMessage.style.marginBottom = '20px';

    const closeButton = document.createElement('button');
    closeButton.textContent = 'Đã hiểu';
    closeButton.className = 'btn btn-primary'; // Sử dụng class của Bootstrap nếu có
    closeButton.style.padding = '10px 20px';
    closeButton.style.border = 'none';
    closeButton.style.borderRadius = '5px';
    closeButton.style.cursor = 'pointer';
    
    closeButton.onclick = () => {
        document.body.removeChild(alertModal);
    };

    alertContent.appendChild(alertMessage);
    alertContent.appendChild(closeButton);
    alertModal.appendChild(alertContent);
    document.body.appendChild(alertModal);
}


// Khởi tạo giỏ hàng khi trang được tải
document.addEventListener('DOMContentLoaded', () => {
    loadCartFromLocalStorage();
});
