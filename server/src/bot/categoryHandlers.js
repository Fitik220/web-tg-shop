const categoryService = require('../services/categoryService');
const { getSession, clearSession } = require('./state');
const keyboards = require('./keyboards');

async function showCategoriesMenu(ctx) {
  clearSession(ctx.chat.id);
  await ctx.reply('📁 Categories', keyboards.categoriesMenu());
}

async function startAddCategory(ctx) {
  const session = getSession(ctx.chat.id);
  session.mode = 'addCategory';
  session.step = 'c_add_name';
  session.data = {};
  await ctx.reply('Enter category name:');
}

async function createCategory(ctx, session, image) {
  try {
    await categoryService.createCategory({ name: session.data.name, image: image || '' });
    clearSession(ctx.chat.id);
    await ctx.reply('✅ Category created successfully!');
    await showCategoriesMenu(ctx);
  } catch (error) {
    clearSession(ctx.chat.id);

    if (error.code === 11000) {
      await ctx.reply('A category with that name already exists.');
    } else {
      await ctx.reply(`Failed to create category: ${error.message}`);
    }

    await showCategoriesMenu(ctx);
  }
}

async function handleText(ctx) {
  const session = getSession(ctx.chat.id);
  const text = ctx.message.text.trim();

  switch (session.step) {
    case 'c_add_name':
      session.data.name = text;
      session.step = 'c_add_image';
      await ctx.reply("Send category image, or type /skip to continue without one:");
      return true;

    case 'c_add_image':
      if (text === '/skip') {
        await createCategory(ctx, session);
      } else {
        await ctx.reply("Please send a photo, or type /skip to continue without one:");
      }
      return true;

    default:
      return false;
  }
}

async function handlePhoto(ctx) {
  const session = getSession(ctx.chat.id);

  if (session.step === 'c_add_image') {
    const photos = ctx.message.photo;
    const fileId = photos[photos.length - 1].file_id;
    await createCategory(ctx, session, fileId);
    return true;
  }

  return false;
}

async function listCategories(ctx) {
  const categories = await categoryService.listCategories();

  if (categories.length === 0) {
    await ctx.reply('No categories yet.', keyboards.categoriesMenu());
    return;
  }

  const lines = categories.map((c, index) => `${index + 1}. ${c.name}`);
  await ctx.reply(`📁 Categories\n\n${lines.join('\n')}\n\nTap a category below to delete it:`, keyboards.categoryListKeyboard(categories));
}

async function confirmDeleteCategory(ctx, id) {
  const category = await categoryService.getCategoryById(id);

  if (!category) {
    await ctx.reply('Category not found.', keyboards.categoriesMenu());
    return;
  }

  await ctx.reply(`Are you sure?\n\n${category.name}`, keyboards.confirmDeleteCategoryKeyboard(id));
}

async function deleteCategoryConfirmed(ctx, id) {
  try {
    await categoryService.deleteCategory(id);
    await ctx.answerCbQuery();
    await ctx.reply('✅ Category deleted');
  } catch (error) {
    await ctx.answerCbQuery();
    await ctx.reply(`⚠️ ${error.message}`);
  }

  await listCategories(ctx);
}

module.exports = {
  showCategoriesMenu,
  startAddCategory,
  handleText,
  handlePhoto,
  listCategories,
  confirmDeleteCategory,
  deleteCategoryConfirmed,
};
