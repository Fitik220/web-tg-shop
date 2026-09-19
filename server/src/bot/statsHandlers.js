const statsService = require('../services/statsService');
const keyboards = require('./keyboards');

function formatMoney(amount) {
  return amount.toLocaleString('en-US');
}

function formatStats(stats) {
  const lowStockLines = stats.lowStockProducts.length === 0
    ? 'None'
    : stats.lowStockProducts.map((p) => `${p.name} — ${p.stock}`).join('\n');

  return `📊 Statistics\n\n`
    + `👤 Users: ${stats.users}\n`
    + `🛍 Products: ${stats.products}\n`
    + `📂 Categories: ${stats.categories}\n\n`
    + `📦 Orders\n`
    + `Pending: ${stats.orders.pending}\n`
    + `Confirmed: ${stats.orders.confirmed}\n`
    + `Completed: ${stats.orders.completed}\n`
    + `Cancelled: ${stats.orders.cancelled}\n\n`
    + `💰 Completed revenue:\n$${formatMoney(stats.completedRevenue)}\n\n`
    + `⚠️ Low stock:\n${lowStockLines}`;
}

async function showStats(ctx) {
  const stats = await statsService.getStats();
  await ctx.reply(formatStats(stats), keyboards.statsKeyboard());
}

module.exports = { showStats };
