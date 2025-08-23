// Placeholder product model. Replace with real DB logic for production.

class ProductModel {
  constructor() {
    // In-memory store: [{ id, name, price, description }]
    this.products = [];
    this.currentId = 1;
  }

  getAllProducts() {
    return this.products;
  }

  getProductById(id) {
    return this.products.find(product => product.id === parseInt(id));
  }

  createProduct(data) {
    const newProduct = {
      id: this.currentId++,
      name: data.name,
      price: data.price,
      description: data.description
    };
    this.products.push(newProduct);
    return newProduct;
  }

  updateProduct(id, data) {
    const product = this.getProductById(id);
    if (!product) return null;
    product.name = data.name !== undefined ? data.name : product.name;
    product.price = data.price !== undefined ? data.price : product.price;
    product.description = data.description !== undefined ? data.description : product.description;
    return product;
  }

  deleteProduct(id) {
    const index = this.products.findIndex(product => product.id === parseInt(id));
    if (index === -1) return false;
    this.products.splice(index, 1);
    return true;
  }
}

module.exports = new ProductModel();