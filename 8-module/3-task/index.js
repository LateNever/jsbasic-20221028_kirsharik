export default class Cart {
  cartItems = []; // [product: {...}, count: N]

  constructor(cartIcon) {
    this.cartIcon = cartIcon;
  }

  addProduct(product) {

    // if (Boolean(product) === false) {return};
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
    // this.onProductUpdate()
    console.log(this.cartItems);
  }

  updateProductCount(productId, amount) {
    let cartItemsArr = this.cartItems;
    cartItemsArr.forEach(function(item, index){
      if (item.product.id.includes(productId)) {
        item.count = item.count + amount;
        if (item.count <= 0) {item.count = 0};
      }

      if (item.count == 0) {
        cartItemsArr.splice(index, 1);
      }
    })
    // this.onProductUpdate()
    this.cartIcon.update(this);
  }

  isEmpty() {
    return this.cartItems.length === 0;
    // if (this.cartItems.length == 0) {
    //   return true
    // } else {
    //   return false
    // };
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

  onProductUpdate(cartItem) {
    // реализуем в следующей задаче

    this.cartIcon.update(this);
  }
}

