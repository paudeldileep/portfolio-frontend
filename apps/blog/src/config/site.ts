export const SITE_NAME = 'Engineering Notes';
export const SITE_TITLE = 'Engineering Notes | Dileep T';
export const SITE_DESCRIPTION =
  'Practical notes on frontend engineering, accessibility, architecture, and AI-augmented development.';
export const DEFAULT_SOCIAL_IMAGE_PATH = '/blog/opengraph-image';

const LOCAL_SITE_URL = 'http://localhost:3000';

export function getSiteUrl(): URL {
  const configuredUrl = process.env.NEXT_PUBLIC_SITE_URL ?? LOCAL_SITE_URL;

  try {
    return new URL(configuredUrl);
  } catch {
    throw new Error(
      `NEXT_PUBLIC_SITE_URL must be an absolute URL. Received "${configuredUrl}".`,
    );
  }
}

export function absoluteUrl(pathname: string): string {
  return new URL(pathname, getSiteUrl()).toString();
}
