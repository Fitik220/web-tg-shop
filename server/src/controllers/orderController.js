const orderService = require('../services/orderService');

async function createOrder(req, res, next) {
  try {
    const { items, customer } = req.body;
    const order = await orderService.createOrder(req.user._id, { items, customer });
    res.status(201).json(order);
  } catch (error) {
    next(error);
  }
}

async function getMyOrders(req, res, next) {
  try {
    const orders = await orderService.getMyOrders(req.user._id);
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

async function getMyOrderById(req, res, next) {
  try {
    const order = await orderService.getOrderForUser(req.params.id, req.user._id);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

async function getAllOrders(req, res, next) {
  try {
    const { status, limit } = req.query;
    const orders = await orderService.listOrders({ status, limit: limit ? parseInt(limit, 10) : undefined });
    res.json(orders);
  } catch (error) {
    next(error);
  }
}

async function updateOrderStatus(req, res, next) {
  try {
    const { status } = req.body;
    const order = await orderService.updateOrderStatus(req.params.id, status);
    res.json(order);
  } catch (error) {
    next(error);
  }
}

module.exports = {
  createOrder, getMyOrders, getMyOrderById, getAllOrders, updateOrderStatus,
};
