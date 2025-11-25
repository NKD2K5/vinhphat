import LogRocket from 'logrocket';

const APP_ID = process.env.NEXT_PUBLIC_LOGROCKET_APP_ID || 'your-app-id';

let isInitialized = false;

export function initLogRocket() {
  if (typeof window === 'undefined') return;
  if (!APP_ID) return;
  if (isInitialized) return;

  LogRocket.init(APP_ID);
  isInitialized = true;
}

export function identifyUser(user) {
  if (typeof window === 'undefined') return;
  if (!user || !user.id) return;

  initLogRocket();

  LogRocket.identify(String(user.id), {
    email: user.email || undefined,
    name: user.name || undefined,
    role: user.role || undefined,
    timestamp_login: user.timestamp_login || new Date().toISOString(),
  });
}

export function trackEvent(name, properties) {
  if (typeof window === 'undefined') return;
  if (!name) return;

  initLogRocket();

  if (properties) {
    LogRocket.track(name, properties);
  } else {
    LogRocket.track(name);
  }
}
