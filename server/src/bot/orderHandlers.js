const orderService = require('../services/orderService');
const keyboards = require('./keyboards');

function shortId(order) {
  return order._id.toString().slice(-6).toUpperCase();
}

function formatOrderSummary(order) {
  return { ...order.toObject(), shortId: shortId(order) };
}

function formatOrderDetail(order) {
  const productLines = order.items.map((item) => `${item.name} × ${item.quantity}`).join('\n');

  return `Order #${shortId(order)}\n\n`
    + `Customer:\n${order.customer.name}\n\n`
    + `Phone:\n${order.customer.phone}\n\n`
    + `Address:\n${order.customer.address}\n\n`
    + `Products:\n${productLines}\n\n`
    + `Total:\n$${order.totalPrice}\n\n`
    + `Status:\n${order.status}`;
}

async function showOrders(ctx) {
  const orders = await orderService.listOrders({ limit: 10 });

  if (orders.length === 0) {
    await ctx.reply('No orders yet.', keyboards.mainMenu());
    return;
  }

  const summaries = orders.map(formatOrderSummary);
  await ctx.reply('🛒 Orders', keyboards.orderListKeyboard(summaries));
}

async function viewOrder(ctx, id) {
  const order = await orderService.getOrderById(id);
  await ctx.reply(formatOrderDetail(order), keyboards.orderDetailKeyboard(order));
}

async function setOrderStatus(ctx, status, id) {
  try {
    const order = await orderService.updateOrderStatus(id, status);
    await ctx.answerCbQuery();
    const label = status.charAt(0).toUpperCase() + status.slice(1);
    await ctx.reply(`✅ Order #${shortId(order)} status changed to ${label}`);
    await viewOrder(ctx, id);
  } catch (error) {
    await ctx.answerCbQuery();
    await ctx.reply(`⚠️ ${error.message}`);
  }
}

module.exports = { showOrders, viewOrder, setOrderStatus };
