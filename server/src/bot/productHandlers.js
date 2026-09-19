const productService = require('../services/productService');
const categoryService = require('../services/categoryService');
const { getSession, clearSession } = require('./state');
const keyboards = require('./keyboards');

function formatProduct(product) {
  const categoryName = product.category && product.category.name ? product.category.name : 'Unknown';

  return `Name: ${product.name}\n`
    + `Description: ${product.description}\n`
    + `Price: $${product.price}\n`
    + `Stock: ${product.stock}\n`
    + `Category: ${categoryName}`;
}

async function showProductsMenu(ctx) {
  clearSession(ctx.chat.id);
  await ctx.reply('📦 Products', keyboards.productsMenu());
}

async function startAddProduct(ctx) {
  const session = getSession(ctx.chat.id);
  session.mode = 'add';
  session.step = 'p_add_name';
  session.data = {};
  await ctx.reply('Enter product name:');
}

async function cancelWizard(ctx) {
  clearSession(ctx.chat.id);
  await ctx.reply('❌ Cancelled');
  await showProductsMenu(ctx);
}

async function askForCategory(ctx, session, prefix) {
  const categories = await categoryService.listCategories();

  if (categories.length === 0) {
    clearSession(ctx.chat.id);
    await ctx.reply('No categories yet. Please add a category first (📁 Categories → ➕ Add Category).');
    return;
  }

  await ctx.reply('Choose category:', keyboards.categoryChoiceKeyboard(categories, prefix));
}

async function handleText(ctx) {
  const session = getSession(ctx.chat.id);
  const text = ctx.message.text.trim();

  switch (session.step) {
    case 'p_add_name':
      session.data.name = text;
      session.step = 'p_add_description';
      await ctx.reply('Enter description:');
      return true;

    case 'p_add_description':
      session.data.description = text;
      session.step = 'p_add_price';
      await ctx.reply('Enter price:');
      return true;

    case 'p_add_price': {
      const price = parseFloat(text);

      if (Number.isNaN(price) || price < 0) {
        await ctx.reply('Please enter a valid price (number):');
        return true;
      }

      session.data.price = price;
      session.step = 'p_add_stock';
      await ctx.reply('Enter stock:');
      return true;
    }

    case 'p_add_stock': {
      const stock = parseInt(text, 10);

      if (Number.isNaN(stock) || stock < 0) {
        await ctx.reply('Please enter a valid stock quantity (whole number):');
        return true;
      }

      session.data.stock = stock;
      session.step = 'p_add_category';
      await askForCategory(ctx, session, 'chooseCategory');
      return true;
    }

    case 'p_edit_field': {
      const { field, productId } = session;
      let value = text;

      if (field === 'price') {
        value = parseFloat(text);

        if (Number.isNaN(value) || value < 0) {
          await ctx.reply('Please enter a valid price (number):');
          return true;
        }
      }

      if (field === 'stock') {
        value = parseInt(text, 10);

        if (Number.isNaN(value) || value < 0) {
          await ctx.reply('Please enter a valid stock quantity (whole number):');
          return true;
        }
      }

      await productService.updateProduct(productId, { [field]: value });
      clearSession(ctx.chat.id);
      await ctx.reply('✅ Product updated');
      await viewProduct(ctx, productId);
      return true;
    }

    default:
      return false;
  }
}

async function handlePhoto(ctx) {
  const session = getSession(ctx.chat.id);
  const photos = ctx.message.photo;
  const fileId = photos[photos.length - 1].file_id;

  if (session.step === 'p_add_image') {
    session.data.image = fileId;
    session.step = 'p_confirm';

    const categoryDoc = await categoryService.getCategoryById(session.data.category);
    const preview = `Product preview\n\n`
      + `Name: ${session.data.name}\n`
      + `Price: $${session.data.price}\n`
      + `Stock: ${session.data.stock}\n`
      + `Category: ${categoryDoc ? categoryDoc.name : 'Unknown'}`;

    await ctx.replyWithPhoto(fileId, { caption: preview });
    await ctx.reply('Create this product?', keyboards.confirmCreateKeyboard());
    return true;
  }

  if (session.step === 'p_edit_field' && session.field === 'image') {
    await productService.updateProduct(session.productId, { image: fileId });
    const { productId } = session;
    clearSession(ctx.chat.id);
    await ctx.reply('✅ Product updated');
    await viewProduct(ctx, productId);
    return true;
  }

  return false;
}

async function chooseCategoryForNewProduct(ctx, categoryId) {
  const session = getSession(ctx.chat.id);

  if (session.step !== 'p_add_category') {
    await ctx.answerCbQuery();
    return;
  }

  session.data.category = categoryId;
  session.step = 'p_add_image';
  await ctx.answerCbQuery();
  await ctx.reply('Send product image:');
}

async function confirmCreateProduct(ctx) {
  const session = getSession(ctx.chat.id);

  if (session.step !== 'p_confirm') {
    await ctx.answerCbQuery();
    return;
  }

  await productService.createProduct(session.data);
  clearSession(ctx.chat.id);
  await ctx.answerCbQuery();
  await ctx.reply('✅ Product created successfully!');
  await showProductsMenu(ctx);
}

async function listProducts(ctx) {
  const { products } = await productService.listProducts({ page: 1, limit: 20 });

  if (products.length === 0) {
    await ctx.reply('No products yet.', keyboards.productsMenu());
    return;
  }

  const lines = products.map((p, index) => `${index + 1}. ${p.name}\n$${p.price}\nStock: ${p.stock}`);

  await ctx.reply(`📦 Products\n\n${lines.join('\n\n')}`, keyboards.productListKeyboard(products));
}

async function viewProduct(ctx, id) {
  const product = await productService.getProductById(id);

  if (!product) {
    await ctx.reply('Product not found.', keyboards.productsMenu());
    return;
  }

  await ctx.reply(formatProduct(product), keyboards.productDetailKeyboard(id));
}

async function startEditProduct(ctx, id) {
  await ctx.reply('What do you want to edit?', keyboards.editFieldKeyboard(id));
}

async function startEditField(ctx, field, id) {
  if (field === 'category') {
    const categories = await categoryService.listCategories();

    if (categories.length === 0) {
      await ctx.reply('No categories available.');
      return;
    }

    await ctx.reply('Choose new category:', keyboards.categoryChoiceKeyboard(categories, `editCategory:${id}`));
    return;
  }

  const session = getSession(ctx.chat.id);
  session.step = 'p_edit_field';
  session.field = field;
  session.productId = id;

  if (field === 'image') {
    await ctx.reply('Send new product image:');
    return;
  }

  await ctx.reply(`Enter new ${field}:`);
}

async function chooseCategoryForEdit(ctx, productId, categoryId) {
  await productService.updateProduct(productId, { category: categoryId });
  clearSession(ctx.chat.id);
  await ctx.answerCbQuery();
  await ctx.reply('✅ Product updated');
  await viewProduct(ctx, productId);
}

async function confirmDeleteProduct(ctx, id) {
  const product = await productService.getProductById(id);

  if (!product) {
    await ctx.reply('Product not found.', keyboards.productsMenu());
    return;
  }

  await ctx.reply(`Are you sure?\n\n${product.name}`, keyboards.confirmDeleteKeyboard(id));
}

async function deleteProductConfirmed(ctx, id) {
  await productService.deleteProduct(id);
  await ctx.answerCbQuery();
  await ctx.reply('✅ Product deleted');
  await listProducts(ctx);
}

module.exports = {
  showProductsMenu,
  startAddProduct,
  cancelWizard,
  handleText,
  handlePhoto,
  chooseCategoryForNewProduct,
  confirmCreateProduct,
  listProducts,
  viewProduct,
  startEditProduct,
  startEditField,
  chooseCategoryForEdit,
  confirmDeleteProduct,
  deleteProductConfirmed,
};
