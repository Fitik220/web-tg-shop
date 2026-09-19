const Product = require('../models/Product');
const categoryService = require('./categoryService');

const DEFAULT_PAGE = 1;
const DEFAULT_LIMIT = 20;

async function listProducts({ search, category, page, limit } = {}) {
  const query = {};

  if (search) {
    query.name = new RegExp(search, 'i');
  }

  if (category && category !== 'all') {
    const categoryDoc = await categoryService.getCategoryByName(category);
    query.category = categoryDoc ? categoryDoc._id : null;
  }

  const currentPage = Math.max(parseInt(page, 10) || DEFAULT_PAGE, 1);
  const currentLimit = Math.max(parseInt(limit, 10) || DEFAULT_LIMIT, 1);
  const skip = (currentPage - 1) * currentLimit;

  const [products, total] = await Promise.all([
    Product.find(query)
      .populate('category', 'name')
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(currentLimit),
    Product.countDocuments(query),
  ]);

  return {
    products,
    page: currentPage,
    limit: currentLimit,
    total,
    totalPages: Math.ceil(total / currentLimit) || 0,
  };
}

async function getProductById(id) {
  return Product.findById(id).populate('category', 'name');
}

async function createProduct(data) {
  return Product.create(data);
}

async function updateProduct(id, updates) {
  return Product.findByIdAndUpdate(id, updates, { new: true, runValidators: true }).populate('category', 'name');
}

async function deleteProduct(id) {
  return Product.findByIdAndDelete(id);
}

async function countByCategory(categoryId) {
  return Product.countDocuments({ category: categoryId });
}

module.exports = {
  listProducts,
  getProductById,
  createProduct,
  updateProduct,
  deleteProduct,
  countByCategory,
};
