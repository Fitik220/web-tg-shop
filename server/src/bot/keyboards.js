const { Markup } = require('telegraf');

function mainMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('🛍 Products', 'menu:products')],
    [Markup.button.callback('📂 Categories', 'menu:categories')],
    [Markup.button.callback('📦 Orders', 'menu:orders')],
    [Markup.button.callback('📊 Statistics', 'menu:stats')],
  ]);
}

function productsMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('➕ Add Product', 'product:add')],
    [Markup.button.callback('📋 Product List', 'product:list')],
    [Markup.button.callback('⬅️ Back', 'menu:main')],
  ]);
}

function categoriesMenu() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('➕ Add Category', 'category:add')],
    [Markup.button.callback('📋 Category List', 'category:list')],
    [Markup.button.callback('⬅️ Back', 'menu:main')],
  ]);
}

function categoryChoiceKeyboard(categories, prefix) {
  const buttons = categories.map((c) => [Markup.button.callback(c.name, `${prefix}:${c._id}`)]);
  buttons.push([Markup.button.callback('❌ Cancel', 'product:cancel')]);
  return Markup.inlineKeyboard(buttons);
}

function confirmCreateKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('✅ Create', 'product:confirmCreate')],
    [Markup.button.callback('❌ Cancel', 'product:cancel')],
  ]);
}

function productListKeyboard(products) {
  const buttons = products.map((p) => [
    Markup.button.callback(`${p.name} — $${p.price}`, `product:view:${p._id}`),
  ]);
  buttons.push([Markup.button.callback('⬅️ Back', 'menu:products')]);
  return Markup.inlineKeyboard(buttons);
}

function productDetailKeyboard(id) {
  return Markup.inlineKeyboard([
    [Markup.button.callback('✏️ Edit', `product:edit:${id}`)],
    [Markup.button.callback('🗑 Delete', `product:delete:${id}`)],
    [Markup.button.callback('⬅️ Back', 'product:list')],
  ]);
}

function editFieldKeyboard(id) {
  return Markup.inlineKeyboard([
    [Markup.button.callback('Name', `product:editField:name:${id}`)],
    [Markup.button.callback('Description', `product:editField:description:${id}`)],
    [Markup.button.callback('Price', `product:editField:price:${id}`)],
    [Markup.button.callback('Stock', `product:editField:stock:${id}`)],
    [Markup.button.callback('Category', `product:editField:category:${id}`)],
    [Markup.button.callback('Image', `product:editField:image:${id}`)],
    [Markup.button.callback('⬅️ Back', `product:view:${id}`)],
  ]);
}

function confirmDeleteKeyboard(id) {
  return Markup.inlineKeyboard([
    [Markup.button.callback('✅ Delete', `product:confirmDelete:${id}`)],
    [Markup.button.callback('❌ Cancel', `product:view:${id}`)],
  ]);
}

function categoryListKeyboard(categories) {
  const buttons = categories.map((c) => [
    Markup.button.callback(`🗑 ${c.name}`, `category:delete:${c._id}`),
  ]);
  buttons.push([Markup.button.callback('⬅️ Back', 'menu:categories')]);
  return Markup.inlineKeyboard(buttons);
}

function confirmDeleteCategoryKeyboard(id) {
  return Markup.inlineKeyboard([
    [Markup.button.callback('✅ Delete', `category:confirmDelete:${id}`)],
    [Markup.button.callback('❌ Cancel', 'category:list')],
  ]);
}

function orderListKeyboard(orders) {
  const buttons = orders.map((o) => [
    Markup.button.callback(`#${o.shortId} — $${o.totalPrice} — ${o.status}`, `order:view:${o._id}`),
  ]);
  buttons.push([Markup.button.callback('⬅️ Back', 'menu:main')]);
  return Markup.inlineKeyboard(buttons);
}

function orderDetailKeyboard(order) {
  const buttons = [];

  if (order.status === 'pending') {
    buttons.push([Markup.button.callback('✅ Confirm', `order:setStatus:confirmed:${order._id}`)]);
    buttons.push([Markup.button.callback('❌ Cancel', `order:setStatus:cancelled:${order._id}`)]);
  }

  if (order.status === 'confirmed') {
    buttons.push([Markup.button.callback('📦 Complete', `order:setStatus:completed:${order._id}`)]);
    buttons.push([Markup.button.callback('❌ Cancel', `order:setStatus:cancelled:${order._id}`)]);
  }

  buttons.push([Markup.button.callback('⬅️ Back', 'menu:orders')]);
  return Markup.inlineKeyboard(buttons);
}

function statsKeyboard() {
  return Markup.inlineKeyboard([
    [Markup.button.callback('⬅️ Back', 'menu:main')],
  ]);
}

module.exports = {
  mainMenu,
  statsKeyboard,
  productsMenu,
  categoriesMenu,
  categoryChoiceKeyboard,
  confirmCreateKeyboard,
  productListKeyboard,
  productDetailKeyboard,
  editFieldKeyboard,
  confirmDeleteKeyboard,
  categoryListKeyboard,
  confirmDeleteCategoryKeyboard,
  orderListKeyboard,
  orderDetailKeyboard,
};
