const LEGACY_HTTP_IMAGE_HOSTS = new Set(['ldm-steel.com', 'www.ldm-steel.com']);

export function normalizeImageUrl(url?: string | null): string | undefined {
  if (!url) {
    return undefined;
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return undefined;
  }

  if (trimmedUrl.startsWith('/')) {
    return trimmedUrl;
  }

  if (trimmedUrl.startsWith('//')) {
    try {
      const parsed = new URL(`https:${trimmedUrl}`);
      if (LEGACY_HTTP_IMAGE_HOSTS.has(parsed.hostname)) {
        return parsed.toString();
      }
    } catch {
      return trimmedUrl;
    }

    return trimmedUrl;
  }

  try {
    const parsed = new URL(trimmedUrl);
    if (parsed.protocol === 'http:' && LEGACY_HTTP_IMAGE_HOSTS.has(parsed.hostname)) {
      parsed.protocol = 'https:';
      return parsed.toString();
    }

    return trimmedUrl;
  } catch {
    return trimmedUrl;
  }
}
