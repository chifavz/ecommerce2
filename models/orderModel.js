// Placeholder order model. Replace with real DB logic for production.

class OrderModel {
  constructor() {
    // In-memory store: [{ id, userId, items: [{ productId, quantity }], status }]
    this.orders = [];
    this.currentId = 1;
  }

  getAllOrders() {
    return this.orders;
  }

  getOrderById(id) {
    return this.orders.find(order => order.id === parseInt(id));
  }

  createOrder(userId, items, status = 'pending') {
    const newOrder = {
      id: this.currentId++,
      userId,
      items,
      status,
      createdAt: new Date()
    };
    this.orders.push(newOrder);
    return newOrder;
  }

  updateOrder(id, data) {
    const order = this.getOrderById(id);
    if (!order) return null;
    Object.assign(order, data);
    return order;
  }

  deleteOrder(id) {
    const index = this.orders.findIndex(order => order.id === parseInt(id));
    if (index === -1) return false;
    this.orders.splice(index, 1);
    return true;
  }
}

module.exports = new OrderModel();