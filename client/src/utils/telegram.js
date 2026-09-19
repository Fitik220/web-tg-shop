export function getWebApp() {
  return typeof window !== 'undefined' ? window.Telegram?.WebApp : undefined;
}

export function isInTelegram() {
  return Boolean(getWebApp()?.initData);
}

export function initTelegram() {
  const webApp = getWebApp();

  if (!webApp) {
    return null;
  }

  webApp.ready();
  webApp.expand();

  return webApp;
}
