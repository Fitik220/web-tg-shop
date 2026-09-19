function isAdmin(ctx) {
  const adminId = process.env.ADMIN_TELEGRAM_ID;
  return Boolean(adminId) && Boolean(ctx.from) && String(ctx.from.id) === String(adminId);
}

async function adminGuard(ctx, next) {
  if (!isAdmin(ctx)) {
    await ctx.reply('❌ Access denied');
    return;
  }

  return next();
}

module.exports = { adminGuard, isAdmin };
