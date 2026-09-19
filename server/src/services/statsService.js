const User = require('../models/User');
const Product = require('../models/Product');
const Category = require('../models/Category');
const Order = require('../models/Order');

const LOW_STOCK_THRESHOLD = 5;
const ORDER_STATUSES = ['pending', 'confirmed', 'completed', 'cancelled'];

async function getStats() {
  const [users, products, categories, orderGroups, lowStockProducts] = await Promise.all([
    User.countDocuments(),
    Product.countDocuments(),
    Category.countDocuments(),
    Order.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 }, revenue: { $sum: '$totalPrice' } } },
    ]),
    Product.find({ stock: { $lte: LOW_STOCK_THRESHOLD } })
      .populate('category', 'name')
      .sort({ stock: 1 }),
  ]);

  const orders = { total: 0 };
  ORDER_STATUSES.forEach((status) => { orders[status] = 0; });

  let completedRevenue = 0;

  orderGroups.forEach((group) => {
    if (ORDER_STATUSES.includes(group._id)) {
      orders[group._id] = group.count;
      orders.total += group.count;
    }

    if (group._id === 'completed') {
      completedRevenue = group.revenue;
    }
  });

  return {
    users,
    products,
    categories,
    orders,
    completedRevenue,
    lowStockProducts,
  };
}

module.exports = { getStats, LOW_STOCK_THRESHOLD };
