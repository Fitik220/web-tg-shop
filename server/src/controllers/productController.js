const productService = require('../services/productService');

async function getProducts(req, res, next) {
  try {
    const { search, category, page, limit } = req.query;
    const result = await productService.listProducts({ search, category, page, limit });
    res.json(result);
  } catch (error) {
    next(error);
  }
}

async function getProduct(req, res, next) {
  try {
    const product = await productService.getProductById(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function createProduct(req, res, next) {
  try {
    const { name, description, price, image, category, stock, isActive } = req.body;

    if (!name || !description || price === undefined || !category) {
      return res.status(400).json({ message: 'name, description, price and category are required' });
    }

    const product = await productService.createProduct({
      name, description, price, image, category, stock, isActive,
    });

    res.status(201).json(product);
  } catch (error) {
    next(error);
  }
}

async function updateProduct(req, res, next) {
  try {
    const product = await productService.updateProduct(req.params.id, req.body);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json(product);
  } catch (error) {
    next(error);
  }
}

async function deleteProduct(req, res, next) {
  try {
    const product = await productService.deleteProduct(req.params.id);

    if (!product) {
      return res.status(404).json({ message: 'Product not found' });
    }

    res.json({ message: 'Product deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getProducts, getProduct, createProduct, updateProduct, deleteProduct };
