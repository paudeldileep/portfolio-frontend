type BlogRewrite = {
  source: string;
  destination: string;
};

export function normalizeBlogOrigin(
  configuredOrigin = process.env.BLOG_ORIGIN,
): string | undefined {
  if (!configuredOrigin) {
    return undefined;
  }

  let parsedOrigin: URL;

  try {
    parsedOrigin = new URL(configuredOrigin);
  } catch {
    throw new Error(
      `BLOG_ORIGIN must be an absolute HTTP(S) URL. Received "${configuredOrigin}".`,
    );
  }

  if (!['http:', 'https:'].includes(parsedOrigin.protocol)) {
    throw new Error('BLOG_ORIGIN must use the HTTP or HTTPS protocol.');
  }

  if (
    parsedOrigin.username ||
    parsedOrigin.password ||
    parsedOrigin.search ||
    parsedOrigin.hash ||
    (parsedOrigin.pathname !== '/' && parsedOrigin.pathname !== '')
  ) {
    throw new Error(
      'BLOG_ORIGIN must contain only the deployment origin, without credentials, a path, query, or fragment.',
    );
  }

  return parsedOrigin.origin;
}

export function getBlogZoneRewrites(
  configuredOrigin = process.env.BLOG_ORIGIN,
): BlogRewrite[] {
  const blogOrigin = normalizeBlogOrigin(configuredOrigin);

  if (!blogOrigin) {
    return [];
  }

  return [
    {
      source: '/blog-static/:path*',
      destination: `${blogOrigin}/blog-static/:path*`,
    },
    {
      source: '/blog',
      destination: `${blogOrigin}/blog`,
    },
    {
      source: '/blog/:path*',
      destination: `${blogOrigin}/blog/:path*`,
    },
  ];
}
