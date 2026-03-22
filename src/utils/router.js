/**
 * Hash-Based SPA Router
 */

export class Router {
  constructor(routes) {
    this.routes = routes;
    this.currentRoute = null;
    this._onRouteChange = this._onRouteChange.bind(this);
    window.addEventListener('hashchange', this._onRouteChange);
  }

  init() {
    this._onRouteChange();
  }

  _onRouteChange() {
    const hash = window.location.hash.slice(1) || '/';
    const { handler, params } = this._matchRoute(hash);
    if (handler) {
      this.currentRoute = hash;
      handler(params);
    }
  }

  _matchRoute(path) {
    for (const route of this.routes) {
      const params = this._extractParams(route.path, path);
      if (params !== null) {
        return { handler: route.handler, params };
      }
    }
    // Fallback to first route
    return { handler: this.routes[0].handler, params: {} };
  }

  _extractParams(pattern, path) {
    const patternParts = pattern.split('/').filter(Boolean);
    const pathParts = path.split('/').filter(Boolean);

    if (patternParts.length !== pathParts.length) return null;

    const params = {};
    for (let i = 0; i < patternParts.length; i++) {
      if (patternParts[i].startsWith(':')) {
        params[patternParts[i].slice(1)] = pathParts[i];
      } else if (patternParts[i] !== pathParts[i]) {
        return null;
      }
    }
    return params;
  }

  navigate(path) {
    window.location.hash = path;
  }
}
