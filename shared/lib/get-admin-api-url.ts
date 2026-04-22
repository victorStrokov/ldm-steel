/**
 * Get the admin panel API URL based on current environment
 *
 * Logic:
 * - If NEXT_PUBLIC_ADMIN_API_URL is set, use it (precedence)
 * - If running on port 3000, admin is on 3001
 * - If running on port 3001, admin is on 3000
 * - Otherwise default to http://localhost:3000
 *
 * Client-side: Determines from browser location
 * Server-side: Should be passed as environment variable or parameter
 */

export function getAdminApiUrl(defaultAdminPort?: number | string): string {
  // 1. Check environment variable first (has precedence)
  if (typeof window === 'undefined') {
    // Server-side
    const envUrl = process.env.NEXT_PUBLIC_ADMIN_API_URL;
    if (envUrl) return envUrl;

    // For server-side, we can't easily detect port from process.env
    // So we default to 3000 or use the provided defaultAdminPort
    const adminPort = defaultAdminPort || 3000;
    return `http://localhost:${adminPort}`;
  } else {
    // Client-side: Detect from window.location
    const hostname = window.location.hostname; // e.g., "localhost"

    // Extract port from host (e.g., "3001" from "localhost:3001")
    let port = window.location.port;

    if (!port) {
      // No explicit port in URL, use default
      port = window.location.protocol === 'https:' ? '443' : '80';
    }

    // Determine admin port based on current port
    let adminPort: string;

    if (port === '3000') {
      // Frontend on 3000, admin on 3001
      adminPort = '3001';
    } else if (port === '3001') {
      // Frontend on 3001, admin on 3000
      adminPort = '3000';
    } else if (port === '80' || port === '443') {
      // Production, same host
      return `${window.location.protocol}//${hostname}`;
    } else {
      // Development on other port, default to 3000
      adminPort = '3000';
    }

    return `http://${hostname}:${adminPort}`;
  }
}

/**
 * Get current app port (client-side only)
 */
export function getCurrentPort(): number | string {
  if (typeof window === 'undefined') {
    return process.env.PORT || 3001;
  }

  return window.location.port || (window.location.protocol === 'https:' ? '443' : '80');
}

/**
 * Get current app URL (client-side)
 */
export function getCurrentAppUrl(): string {
  if (typeof window === 'undefined') {
    return 'http://localhost';
  }

  return `${window.location.protocol}//${window.location.host}`;
}
