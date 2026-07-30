const baseUrl = new URL(
  process.env.SMOKE_BASE_URL ?? "https://iamdileep.vercel.app",
);
const articleSlug =
  process.env.SMOKE_ARTICLE_SLUG ?? "building-an-accessible-content-pipeline";
const privateBlogHost =
  process.env.SMOKE_PRIVATE_BLOG_HOST ?? "iamdileep-blog.vercel.app";

const checks = [
  { path: "/", contentType: "text/html" },
  { path: "/blog", contentType: "text/html" },
  { path: `/blog/${articleSlug}`, contentType: "text/html" },
  { path: "/blog/rss.xml", contentType: "xml" },
  { path: "/blog/sitemap.xml", contentType: "xml" },
];

async function request(path) {
  const url = new URL(path, baseUrl);
  const response = await fetch(url, {
    redirect: "follow",
    signal: AbortSignal.timeout(15_000),
    headers: { "user-agent": "portfolio-deployment-smoke/1.0" },
  });

  if (!response.ok) {
    throw new Error(`${url} returned HTTP ${response.status}`);
  }

  return {
    body: await response.text(),
    contentType: response.headers.get("content-type") ?? "",
    url,
  };
}

for (const check of checks) {
  const result = await request(check.path);

  if (!result.contentType.includes(check.contentType)) {
    throw new Error(
      `${result.url} returned ${result.contentType || "no content type"}; ` +
        `expected ${check.contentType}`,
    );
  }

  if (result.body.includes(privateBlogHost)) {
    throw new Error(`${result.url} exposes the private blog deployment host`);
  }

  console.log(`PASS ${result.url} (${result.contentType})`);
}

const landing = await request("/blog");
const expectedCanonical = new URL("/blog", baseUrl).href.replace(/\/$/, "");
const canonicalMatch = landing.body.match(
  /<link[^>]+rel=["']canonical["'][^>]+href=["']([^"']+)["']/i,
);

if (
  !canonicalMatch ||
  canonicalMatch[1].replace(/\/$/, "") !== expectedCanonical
) {
  throw new Error(
    `Blog canonical was ${canonicalMatch?.[1] ?? "missing"}; ` +
      `expected ${expectedCanonical}`,
  );
}

const assetPath = landing.body
  .match(/["'](\/blog-static\/[^"'? ]+)/)?.[1]
  ?.replaceAll("&amp;", "&");

if (!assetPath) {
  throw new Error("Blog landing did not expose a /blog-static asset");
}

const assetUrl = new URL(assetPath, baseUrl);
const assetResponse = await fetch(assetUrl, {
  signal: AbortSignal.timeout(15_000),
  headers: { "user-agent": "portfolio-deployment-smoke/1.0" },
});

if (!assetResponse.ok) {
  throw new Error(`${assetUrl} returned HTTP ${assetResponse.status}`);
}

console.log(`PASS ${assetUrl} (proxied blog asset)`);
console.log(`Deployment smoke checks passed for ${baseUrl.origin}`);
