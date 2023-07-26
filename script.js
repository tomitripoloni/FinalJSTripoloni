const apiUrl = 'productos.json'; // Ruta al archivo JSON con los productos

let cart = [];
let username;
let totalPrice = 0;
let checkoutFormVisible = false; // Variable para controlar si el formulario de finalizar compra está visible o no


// Función para cargar los productos desde el JSON y mostrarlos en pantalla
function loadProducts() {
  fetch(apiUrl)
    .then((response) => response.json())
    .then((data) => {
      const productsContainer = document.getElementById('productsContainer');
      productsContainer.innerHTML = '';

      data.forEach((product) => {
        const productDiv = document.createElement('div');
        productDiv.classList.add('product');

        const productImage = document.createElement('img');
        productImage.src = product.image;
        productDiv.appendChild(productImage);

        const productName = document.createElement('p');
        productName.classList.add('product-name');
        productName.textContent = product.name;
        productDiv.appendChild(productName);

        // Generar precio aleatorio para el producto entre 1 y 1000
        const productPrice = Math.floor(Math.random() * 1000) + 1;
        const productPriceDisplay = document.createElement('p');
        productPriceDisplay.classList.add('product-price');
        productPriceDisplay.textContent = `$${productPrice}`;
        productDiv.appendChild(productPriceDisplay);

        const addButton = document.createElement('button');
        addButton.textContent = 'Agregar al Carrito';
        addButton.classList.add('btn', 'btn-primary');
        addButton.addEventListener('click', () => addToCart(product, productPrice));
        productDiv.appendChild(addButton);

        productsContainer.appendChild(productDiv);
      });
    })
    .catch((error) => console.error('Error fetching products:', error));
}

// Función para agregar un producto al carrito
function addToCart(product, price) {
  cart.push({ ...product, price });
  totalPrice += price;
  updateCartDisplay();
  // Mostrar Sweet Alert al agregar un producto al carrito
  Swal.fire({
    icon: 'success',
    title: 'Producto Agregado',
    text: `${product.name} agregado al carrito.`,
    showConfirmButton: false,
    timer: 1500
  });
}

// Función para eliminar un producto del carrito
function removeFromCart(productIndex) {
  totalPrice -= cart[productIndex].price;
  cart.splice(productIndex, 1);
  updateCartDisplay();
}

// Función para actualizar la vista del carrito en la navbar
function updateCartDisplay() {
  const cartItemsList = document.getElementById('cartItemsList');
  cartItemsList.innerHTML = '';

  cart.forEach((product) => {
    const cartItem = document.createElement('div');
    cartItem.classList.add('cart-item');

    const productName = document.createElement('p');
    productName.classList.add('cart-item-name');
    productName.textContent = product.name;
    cartItem.appendChild(productName);

    const productPriceDisplay = document.createElement('p');
    productPriceDisplay.classList.add('cart-item-price');
    productPriceDisplay.textContent = `$${product.price}`;
    cartItem.appendChild(productPriceDisplay);

    const removeButton = document.createElement('button');
    removeButton.textContent = 'Eliminar';
    removeButton.classList.add('btn', 'btn-danger');
    removeButton.addEventListener('click', () => removeFromCart(cart.indexOf(product)));
    cartItem.appendChild(removeButton);

    cartItemsList.appendChild(cartItem);
  });

  if (!checkoutFormVisible) {
    // Mostrar el botón "Finalizar Compra" solo si el formulario no está visible
    const checkoutButton = document.createElement('button');
    checkoutButton.textContent = 'Finalizar Compra';
    checkoutButton.classList.add('btn', 'btn-danger', 'mt-3');
    checkoutButton.addEventListener('click', showCheckoutForm);
    cartItemsList.appendChild(checkoutButton);
  }
}

// Función para mostrar el formulario de finalizar compra
function showCheckoutForm() {
  const cartItemsList = document.getElementById('cartItemsList');
  cartItemsList.innerHTML = '';

  const totalPriceDisplay = document.createElement('p');
  totalPriceDisplay.textContent = `Precio Total: $${totalPrice}`;
  totalPriceDisplay.classList.add('text-center', 'font-weight-bold');
  cartItemsList.appendChild(totalPriceDisplay);

  const checkoutForm = document.createElement('form');
  checkoutForm.innerHTML = `
    <h2 class="modal-title">Finalizar Compra</h2>
    <div class="form-group">
      <label for="name">Nombre:</label>
      <input type="text" id="name" class="form-control" required>
    </div>
    <div class="form-group">
      <label for="address">Dirección:</label>
      <input type="text" id="address" class="form-control" required>
    </div>
    <div class="form-group">
      <label for="city">Ciudad:</label>
      <input type="text" id="city" class="form-control" required>
    </div>
    <div class="form-group">
      <label for="deliveryTime">Horario de Entrega:</label>
      <input type="time" id="deliveryTime" class="form-control" min="09:00" max="19:00" required>
    </div>
    <div class="text-center">
      <button type="submit" class="btn btn-danger">Finalizar Compra</button>
      <button type="button" class="btn btn-secondary ml-2" onclick="cancelCheckout()">Cancelar</button>
    </div>
  `;

  checkoutForm.addEventListener('submit', (event) => {
    event.preventDefault();
    const name = document.getElementById('name').value;
    const address = document.getElementById('address').value;
    const city = document.getElementById('city').value;
    const deliveryTime = document.getElementById('deliveryTime').value;
    completePurchase(name, address, city, deliveryTime);
    // Ocultar el formulario de finalizar compra y mostrar el botón "Ver Carrito"
    checkoutFormVisible = false;
    cartItemsList.innerHTML = '';
    updateCartDisplay();
  });

  cartItemsList.appendChild(checkoutForm);
  // Marcar el formulario como visible
  checkoutFormVisible = true;
}

// Función para cancelar el formulario de finalizar compra
function cancelCheckout() {
  const cartItemsList = document.getElementById('cartItemsList');
  // Ocultar el formulario de finalizar compra y mostrar el botón "Finalizar Compra"
  checkoutFormVisible = false;
  cartItemsList.innerHTML = '';
  updateCartDisplay();
}

// Función para completar la compra
function completePurchase(name, address, city, deliveryTime) {
  const message = `¡Gracias por tu compra, ${name}! Tu pedido será entregado en ${address}, ${city} a las ${deliveryTime}.`;
  // Mostrar Sweet Alert al completar la compra
  Swal.fire({
    icon: 'success',
    title: '¡Compra Completada!',
    text: message
  });
}

// Función para iniciar la aplicación después de que se ingresa el nombre de usuario
function startApp() {
  username = document.getElementById('username').value;
  document.getElementById('startButton').disabled = true;
  loadProducts();
}

// Función para mostrar el carrito en la barra de navegación
function showCartMenu() {
  const cartIcon = document.getElementById('cartIcon');
  const cartItemsList = document.getElementById('cartItemsList');

  // Mostrar el carrito al pasar el cursor sobre el ícono
  cartIcon.addEventListener('mouseenter', () => {
    cartItemsList.style.display = 'block';
  });

  // Ocultar el carrito al sacar el cursor del ícono
  cartIcon.addEventListener('mouseleave', () => {
    cartItemsList.style.display = 'none';
  });

  // Mostrar el carrito al hacer clic en el ícono (mantenerlo fijo)
  cartIcon.addEventListener('click', () => {
    cartItemsList.style.display = 'block';
  });
}

// Iniciar la aplicación al cargar la página
document.addEventListener('DOMContentLoaded', () => {
  showCartMenu();
  document.getElementById('startButton').addEventListener('click', startApp);
});
