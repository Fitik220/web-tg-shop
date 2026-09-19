const Order = require('../models/Order');
const Product = require('../models/Product');

const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['completed', 'cancelled'],
  completed: [],
  cancelled: [],
};

function badRequest(message) {
  const error = new Error(message);
  error.statusCode = 400;
  return error;
}

function notFound(message) {
  const error = new Error(message);
  error.statusCode = 404;
  return error;
}

async function createOrder(userId, { items, customer }) {
  if (!items || items.length === 0) {
    throw badRequest('Cart is empty');
  }

  if (!customer || !customer.name || !customer.phone || !customer.address) {
    throw badRequest('Customer name, phone and address are required');
  }

  const products = await Product.find({ _id: { $in: items.map((i) => i.productId) } });
  const productMap = new Map(products.map((p) => [p._id.toString(), p]));

  const orderItems = [];

  for (const item of items) {
    const product = productMap.get(item.productId);
    const quantity = parseInt(item.quantity, 10);

    if (!product) {
      throw notFound('Product not found');
    }

    if (!product.isActive) {
      throw badRequest(`Product is unavailable: ${product.name}`);
    }

    if (!quantity || quantity < 1) {
      throw badRequest(`Invalid quantity for ${product.name}`);
    }

    if (product.stock < quantity) {
      throw badRequest(`Not enough stock for ${product.name}`);
    }

    orderItems.push({
      product: product._id,
      name: product.name,
      price: product.price,
      quantity,
    });
  }

  const decremented = [];

  try {
    for (const item of orderItems) {
      const updated = await Product.findOneAndUpdate(
        { _id: item.product, stock: { $gte: item.quantity }, isActive: true },
        { $inc: { stock: -item.quantity } },
        { new: true },
      );

      if (!updated) {
        throw badRequest(`Not enough stock for ${item.name}`);
      }

      decremented.push(item);
    }
  } catch (error) {
    for (const item of decremented) {
      await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
    }
    throw error;
  }

  const totalPrice = orderItems.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const order = await Order.create({
    user: userId,
    items: orderItems,
    totalPrice,
    customer,
  });

  return order;
}

async function getMyOrders(userId) {
  return Order.find({ user: userId }).sort({ createdAt: -1 });
}

async function getOrderForUser(orderId, userId) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw notFound('Order not found');
  }

  if (order.user.toString() !== userId.toString()) {
    const error = new Error('You cannot access this order');
    error.statusCode = 403;
    throw error;
  }

  return order;
}

async function getOrderById(orderId) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw notFound('Order not found');
  }

  return order;
}

async function listOrders({ status, limit = 10 } = {}) {
  const query = status ? { status } : {};
  return Order.find(query).sort({ createdAt: -1 }).limit(limit);
}

async function restoreStock(order) {
  if (order.stockRestored) {
    return;
  }

  for (const item of order.items) {
    await Product.updateOne({ _id: item.product }, { $inc: { stock: item.quantity } });
  }

  order.stockRestored = true;
}

async function updateOrderStatus(orderId, nextStatus) {
  const order = await Order.findById(orderId);

  if (!order) {
    throw notFound('Order not found');
  }

  const allowed = ALLOWED_TRANSITIONS[order.status] || [];

  if (!allowed.includes(nextStatus)) {
    throw badRequest(`Cannot change order status from ${order.status} to ${nextStatus}`);
  }

  if (nextStatus === 'cancelled') {
    await restoreStock(order);
  }

  order.status = nextStatus;
  await order.save();

  return order;
}

module.exports = {
  createOrder,
  getMyOrders,
  getOrderForUser,
  getOrderById,
  listOrders,
  updateOrderStatus,
};
