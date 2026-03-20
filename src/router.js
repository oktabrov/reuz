// ==========================================
// ReUz — SPA Hash Router
// ==========================================

class Router {
  constructor() {
    this.routes = [];
    this.currentRoute = null;
    this.beforeEach = null;
    window.addEventListener('hashchange', () => this.resolve());
  }

  add(pattern, handler) {
    this.routes.push({
      pattern: this.patternToRegex(pattern),
      rawPattern: pattern,
      handler
    });
    return this;
  }

  patternToRegex(pattern) {
    const regexStr = pattern
      .replace(/:[a-zA-Z]+/g, '([^/]+)')
      .replace(/\//g, '\\/');
    return new RegExp(`^${regexStr}$`);
  }

  navigate(path) {
    window.location.hash = path;
  }

  resolve() {
    const hash = window.location.hash.slice(1) || '/';

    if (this.beforeEach) {
      const allowed = this.beforeEach(hash);
      if (!allowed) return;
    }

    for (const route of this.routes) {
      const match = hash.match(route.pattern);
      if (match) {
        const params = match.slice(1);
        this.currentRoute = { path: hash, pattern: route.rawPattern, params };
        route.handler(...params);
        return;
      }
    }

    // 404 fallback
    this.navigate('/');
  }

  start() {
    this.resolve();
  }
}

export const router = new Router();

export function navigateTo(path) {
  router.navigate(path);
}
