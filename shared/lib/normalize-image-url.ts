const LEGACY_HTTP_IMAGE_HOSTS = new Set(['ldm-steel.com', 'www.ldm-steel.com']);

const LEGACY_IMAGE_FILE_MAP: Record<string, string> = {
  'kr_kr_m.png': '/assets/moskit7016.png',
  'kr_dl_m.png': '/assets/moskit9016.png',
  'setka_rul.jpg': '/assets/moskit8017.png',
  'shnurpvc.jpg': '/assets/moskit8017.png',
  'petlyMoskitSetka.png': '/assets/moskit8017.png',
  'pvc-panel.jpg': '/no-image.png',
};

function mapLegacyImageByFilename(pathname: string): string | undefined {
  const fileName = pathname.split('/').pop();
  if (!fileName) {
    return undefined;
  }

  return LEGACY_IMAGE_FILE_MAP[fileName];
}

export function normalizeImageUrl(url?: string | null): string | undefined {
  if (!url) {
    return undefined;
  }

  const trimmedUrl = url.trim();
  if (!trimmedUrl) {
    return undefined;
  }

  if (trimmedUrl.startsWith('/')) {
    const mappedLocal = mapLegacyImageByFilename(trimmedUrl);
    if (mappedLocal) {
      return mappedLocal;
    }

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

    const mappedLegacy = mapLegacyImageByFilename(parsed.pathname);
    if (mappedLegacy) {
      return mappedLegacy;
    }

    // Keep legacy host URLs as-is to avoid SSL issues from forced https upgrade.
    if (LEGACY_HTTP_IMAGE_HOSTS.has(parsed.hostname)) {
      return parsed.toString();
    }

    return trimmedUrl;
  } catch {
    return trimmedUrl;
  }
}
