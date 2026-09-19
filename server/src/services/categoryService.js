const Category = require('../models/Category');
const Product = require('../models/Product');

async function listCategories() {
  return Category.find().sort({ name: 1 });
}

async function getCategoryById(id) {
  return Category.findById(id);
}

async function getCategoryByName(name) {
  return Category.findOne({ name: new RegExp(`^${name}$`, 'i') });
}

async function createCategory({ name, image }) {
  return Category.create({ name, image });
}

async function updateCategory(id, updates) {
  return Category.findByIdAndUpdate(id, updates, { new: true, runValidators: true });
}

async function deleteCategory(id) {
  const productCount = await Product.countDocuments({ category: id });

  if (productCount > 0) {
    const error = new Error('Cannot delete category: it still has products assigned to it');
    error.statusCode = 400;
    throw error;
  }

  return Category.findByIdAndDelete(id);
}

module.exports = {
  listCategories,
  getCategoryById,
  getCategoryByName,
  createCategory,
  updateCategory,
  deleteCategory,
};
