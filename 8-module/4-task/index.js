import createElement from '../../assets/lib/create-element.js';
import escapeHtml from '../../assets/lib/escape-html.js';

import Modal from '../../7-module/2-task/index.js';

export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;

    this.addEventListeners();
  }

  addProduct(product) {
        if (!product) {return};

    let includeCheck = false
    this.cartItems.forEach(function(item){
      if (item.product.id.includes(product.id)) {
        item.count++;
        includeCheck = true;
      }
    })

    if (includeCheck == false) {
      this.cartItems.push({
          product: product,
          count: 1
        });
      }

    this.cartIcon.update(this);
  }

  updateProductCount(productId, amount) {
    let cartItemsArr = this.cartItems;
    let cartItem

    cartItemsArr.forEach(function(item, index){
      if (item.product.id.includes(productId)) {
        cartItem = item;
        item.count = item.count + amount;
        if (item.count <= 0) {item.count = 0};
      }

      if (item.count == 0) {
        cartItemsArr.splice(index, 1);
      }
    })

    this.onProductUpdate(cartItem)
    this.cartIcon.update(this);
  }

  isEmpty() {
    return this.cartItems.length === 0;
  }

  getTotalCount() {
    let totalCount = 0;
    this.cartItems.forEach(function(item){
      totalCount += item.count;
    })
    return totalCount;
  }

  getTotalPrice() {
    let totalPrice = 0;
    this.cartItems.forEach(function(item){
      totalPrice += (item.count * item.product.price);
    })
    return totalPrice;
  }

  renderProduct(product, count) {
    return createElement(`
    <div class="cart-product" data-product-id="${
      product.id
    }">
      <div class="cart-product__img">
        <img src="/assets/images/products/${product.image}" alt="product">
      </div>
      <div class="cart-product__info">
        <div class="cart-product__title">${escapeHtml(product.name)}</div>
        <div class="cart-product__price-wrap">
          <div class="cart-counter">
            <button type="button" class="cart-counter__button cart-counter__button_minus">
              <img src="/assets/images/icons/square-minus-icon.svg" alt="minus">
            </button>
            <span class="cart-counter__count">${count}</span>
            <button type="button" class="cart-counter__button cart-counter__button_plus">
              <img src="/assets/images/icons/square-plus-icon.svg" alt="plus">
            </button>
          </div>
          <div class="cart-product__price">€${product.price.toFixed(2)}</div>
        </div>
      </div>
    </div>`);
  }

  renderOrderForm() {
    return createElement(`<form class="cart-form">
      <h5 class="cart-form__title">Delivery</h5>
      <div class="cart-form__group cart-form__group_row">
        <input name="name" type="text" class="cart-form__input" placeholder="Name" required value="Santa Claus">
        <input name="email" type="email" class="cart-form__input" placeholder="Email" required value="john@gmail.com">
        <input name="tel" type="tel" class="cart-form__input" placeholder="Phone" required value="+1234567">
      </div>
      <div class="cart-form__group">
        <input name="address" type="text" class="cart-form__input" placeholder="Address" required value="North, Lapland, Snow Home">
      </div>
      <div class="cart-buttons">
        <div class="cart-buttons__buttons btn-group">
          <div class="cart-buttons__info">
            <span class="cart-buttons__info-text">total</span>
            <span class="cart-buttons__info-price">€${this.getTotalPrice().toFixed(
              2
            )}</span>
          </div>
          <button type="submit" class="cart-buttons__button btn-group__button button">order</button>
        </div>
      </div>
    </form>`);
  }

  renderModal() {
    let modalCart = new Modal();
    this.modalCart = modalCart;

    modalCart.setTitle('Your order');

    let modalBody = createElement(`<div></div>`)

    this.cartItems.forEach((item) => {
      let itemCard
      itemCard = this.renderProduct(item.product, item.count)
      modalBody.append(itemCard);
    })

    modalBody.append(this.renderOrderForm())

    modalCart.setBody(modalBody);
    
    modalCart.open();
  }

  onProductUpdate(cartItem) {

    let body = document.querySelector('body');
    
    if (body.classList.contains('is-modal-open')) {

      let productId = cartItem.product.id;

      let modalBody = document.querySelector('.modal__body');

      let productCount = modalBody.querySelector(`[data-product-id="${productId}"] .cart-counter__count`);
      let productPrice = modalBody.querySelector(`[data-product-id="${productId}"] .cart-product__price`);
      let infoPrice = modalBody.querySelector(`.cart-buttons__info-price`);

      let modalBodyDiv = modalBody.firstChild;

      let cartItemDiv = modalBody.querySelector(`[data-product-id="${productId}"]`);

      console.log(this.cartItems);

      productCount.innerHTML = cartItem.count;
      productPrice.innerHTML = `€${(cartItem.count * cartItem.product.price).toFixed(2)}`;
      infoPrice.innerHTML = `€${this.getTotalPrice().toFixed(2)}`;

      if (cartItem.count == 0) {
        modalBodyDiv.removeChild(cartItemDiv);
        if (this.cartItems.length == 0) {this.modalCart.close()}
      }
      
    }

    this.cartIcon.update(this);
  }

  onSubmit = (event) => {
    event.preventDefault();

    let buttonSubmit = document.querySelector('.cart-buttons__button')
    buttonSubmit.classList.add('is-loading');

    let form = document.querySelector('.cart-form')

    fetch('https://httpbin.org/post', {
      method: 'POST',
      body: new FormData(form)
    })
      .then(response => {
        if (response.ok) {
          this.modalCart.setTitle('Success!');
          this.cartItems = [];
          let modalBody = document.querySelector('.modal__body')
          modalBody.innerHTML = `          
          <div class="modal__body-inner">
            <p>
              Order successful! Your order is being cooked :) <br>
              We’ll notify you about delivery time shortly.<br>
              <img src="/assets/images/delivery.gif">
            </p>
          </div>
          `;
          this.cartIcon.update(this);
        }
      })
  };

  addEventListeners() {
    this.cartIcon.elem.onclick = () => this.renderModal();

    document.addEventListener('click', (event) => {
      let button = event.target.closest('.cart-counter__button');
      if (!button) {
        return;
      }

      let amount
      if (button.classList.contains('cart-counter__button_plus')) {amount = 1};
      if (button.classList.contains('cart-counter__button_minus')) {amount = -1};

      let cartProduct = event.target.closest('.cart-product');

      this.updateProductCount(cartProduct.dataset.productId, amount)
    })

    document.addEventListener('submit', this.onSubmit)
  }
}