const categoryService = require('../services/categoryService');

async function getCategories(req, res, next) {
  try {
    const categories = await categoryService.listCategories();
    res.json(categories);
  } catch (error) {
    next(error);
  }
}

async function getCategory(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
}

async function createCategory(req, res, next) {
  try {
    const { name, image } = req.body;

    if (!name) {
      return res.status(400).json({ message: 'name is required' });
    }

    const existing = await categoryService.getCategoryByName(name);

    if (existing) {
      return res.status(400).json({ message: 'Category already exists' });
    }

    const category = await categoryService.createCategory({ name, image });
    res.status(201).json(category);
  } catch (error) {
    next(error);
  }
}

async function updateCategory(req, res, next) {
  try {
    const category = await categoryService.updateCategory(req.params.id, req.body);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    res.json(category);
  } catch (error) {
    next(error);
  }
}

async function deleteCategory(req, res, next) {
  try {
    const category = await categoryService.getCategoryById(req.params.id);

    if (!category) {
      return res.status(404).json({ message: 'Category not found' });
    }

    await categoryService.deleteCategory(req.params.id);
    res.json({ message: 'Category deleted' });
  } catch (error) {
    next(error);
  }
}

module.exports = { getCategories, getCategory, createCategory, updateCategory, deleteCategory };
