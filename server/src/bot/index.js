const { Telegraf } = require('telegraf');
const { adminGuard } = require('./adminGuard');
const keyboards = require('./keyboards');
const { clearSession } = require('./state');
const productHandlers = require('./productHandlers');
const categoryHandlers = require('./categoryHandlers');
const orderHandlers = require('./orderHandlers');
const statsHandlers = require('./statsHandlers');

function createBot() {
  const token = process.env.TELEGRAM_BOT_TOKEN;

  if (!token) {
    console.log('TELEGRAM_BOT_TOKEN not set, Telegram bot disabled');
    return null;
  }

  const bot = new Telegraf(token);

  bot.use(adminGuard);

  bot.start(async (ctx) => {
    clearSession(ctx.chat.id);
    await ctx.reply('🛒 Store Admin', keyboards.mainMenu());
  });

  bot.action('menu:main', async (ctx) => {
    clearSession(ctx.chat.id);
    await ctx.answerCbQuery();
    await ctx.reply('🛒 Store Admin', keyboards.mainMenu());
  });

  bot.action('menu:products', async (ctx) => {
    await ctx.answerCbQuery();
    await productHandlers.showProductsMenu(ctx);
  });

  bot.action('menu:categories', async (ctx) => {
    await ctx.answerCbQuery();
    await categoryHandlers.showCategoriesMenu(ctx);
  });

  bot.action('menu:orders', async (ctx) => {
    await ctx.answerCbQuery();
    await orderHandlers.showOrders(ctx);
  });

  bot.action('menu:stats', async (ctx) => {
    await ctx.answerCbQuery();
    await statsHandlers.showStats(ctx);
  });

  // Product actions
  bot.action('product:add', async (ctx) => {
    await ctx.answerCbQuery();
    await productHandlers.startAddProduct(ctx);
  });

  bot.action('product:list', async (ctx) => {
    await ctx.answerCbQuery();
    await productHandlers.listProducts(ctx);
  });

  bot.action('product:cancel', async (ctx) => {
    await ctx.answerCbQuery();
    await productHandlers.cancelWizard(ctx);
  });

  bot.action('product:confirmCreate', productHandlers.confirmCreateProduct);

  bot.action(/^product:view:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    await productHandlers.viewProduct(ctx, ctx.match[1]);
  });

  bot.action(/^product:edit:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    await productHandlers.startEditProduct(ctx, ctx.match[1]);
  });

  bot.action(/^product:editField:(name|description|price|stock|category|image):(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    await productHandlers.startEditField(ctx, ctx.match[1], ctx.match[2]);
  });

  bot.action(/^product:delete:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    await productHandlers.confirmDeleteProduct(ctx, ctx.match[1]);
  });

  bot.action(/^product:confirmDelete:(.+)$/, async (ctx) => {
    await productHandlers.deleteProductConfirmed(ctx, ctx.match[1]);
  });

  bot.action(/^chooseCategory:(.+)$/, async (ctx) => {
    await productHandlers.chooseCategoryForNewProduct(ctx, ctx.match[1]);
  });

  bot.action(/^editCategory:(.+):(.+)$/, async (ctx) => {
    await productHandlers.chooseCategoryForEdit(ctx, ctx.match[1], ctx.match[2]);
  });

  // Category actions
  bot.action('category:add', async (ctx) => {
    await ctx.answerCbQuery();
    await categoryHandlers.startAddCategory(ctx);
  });

  bot.action('category:list', async (ctx) => {
    await ctx.answerCbQuery();
    await categoryHandlers.listCategories(ctx);
  });

  bot.action(/^category:delete:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    await categoryHandlers.confirmDeleteCategory(ctx, ctx.match[1]);
  });

  bot.action(/^category:confirmDelete:(.+)$/, async (ctx) => {
    await categoryHandlers.deleteCategoryConfirmed(ctx, ctx.match[1]);
  });

  // Order actions
  bot.action(/^order:view:(.+)$/, async (ctx) => {
    await ctx.answerCbQuery();
    await orderHandlers.viewOrder(ctx, ctx.match[1]);
  });

  bot.action(/^order:setStatus:(confirmed|completed|cancelled):(.+)$/, async (ctx) => {
    await orderHandlers.setOrderStatus(ctx, ctx.match[1], ctx.match[2]);
  });

  // Text and photo input for wizards
  bot.on('text', async (ctx) => {
    if (ctx.message.text.startsWith('/start')) {
      return;
    }

    const handledByProduct = await productHandlers.handleText(ctx);

    if (!handledByProduct) {
      await categoryHandlers.handleText(ctx);
    }
  });

  bot.on('photo', async (ctx) => {
    const handledByProduct = await productHandlers.handlePhoto(ctx);

    if (!handledByProduct) {
      await categoryHandlers.handlePhoto(ctx);
    }
  });

  bot.catch((err, ctx) => {
    console.error('Telegram bot error:', err);
    ctx.reply('⚠️ Something went wrong. Please try again.').catch(() => {});
  });

  return bot;
}

function startBot() {
  const bot = createBot();

  if (!bot) {
    return null;
  }

  bot.launch();
  console.log('Telegram bot started');

  process.once('SIGINT', () => bot.stop('SIGINT'));
  process.once('SIGTERM', () => bot.stop('SIGTERM'));

  return bot;
}

module.exports = { startBot };
