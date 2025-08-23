// This is a placeholder cart model. Replace with real DB logic for production.

class CartModel {
  constructor() {
    // In-memory store: { userId: [ { productId, quantity } ] }
    this.carts = {};
  }

  getCart(userId) {
    return this.carts[userId] || [];
  }

  addToCart(userId, productId, quantity) {
    if (!this.carts[userId]) this.carts[userId] = [];
    this.carts[userId].push({ productId, quantity });
    return this.carts[userId];
  }

  updateCartItem(userId, productId, quantity) {
    if (!this.carts[userId]) return null;
    const item = this.carts[userId].find(i => i.productId === productId);
    if (!item) return null;
    item.quantity = quantity;
    return item;
  }

  removeFromCart(userId, productId) {
    if (!this.carts[userId]) return null;
    this.carts[userId] = this.carts[userId].filter(i => i.productId !== productId);
    return this.carts[userId];
  }

  clearCart(userId) {
    this.carts[userId] = [];
    return [];
  }
}


module.exports = new CartModel();