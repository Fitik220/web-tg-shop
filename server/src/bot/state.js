const sessions = new Map();

function getSession(chatId) {
  if (!sessions.has(chatId)) {
    sessions.set(chatId, { data: {} });
  }
  return sessions.get(chatId);
}

function clearSession(chatId) {
  sessions.set(chatId, { data: {} });
}

module.exports = { getSession, clearSession };
