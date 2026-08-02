import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const BLOG_BASE_URL = process.env.PLAYWRIGHT_BLOG_BASE_URL ?? 'http://localhost:3101';
const ARTICLE_PATH = '/building-an-accessible-content-pipeline';
const TAG_PATH = '/tag/accessibility';

function blogUrl(path: string) {
  return new URL(path, `${BLOG_BASE_URL}/`).toString();
}

async function gotoReady(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
  const status = response?.status() ?? 500;

  expect(status, `Expected a non-error response for ${path}`).toBeLessThan(400);
  await expect(page.getByRole('main')).toBeVisible();
}

async function gotoBlogReady(page: Page, path: string) {
  const response = await page.goto(blogUrl(path), { waitUntil: 'domcontentloaded' });
  const status = response?.status() ?? 500;

  expect(status, `Expected a non-error response for ${path}`).toBeLessThan(400);
  await expect(page.getByRole('main')).toBeVisible();
}

async function expectNoSeriousAxeViolations(page: Page) {
  const results = await new AxeBuilder({ page })
    .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
    .analyze();
  const seriousViolations = results.violations.filter(
    ({ impact }) => impact === 'serious' || impact === 'critical',
  );

  expect(seriousViolations).toEqual([]);
}

test.describe('Blog routes and reading experience', () => {
  test('renders the landing, representative article, and tag archive', async ({
    page,
    isMobile,
  }) => {
    await gotoBlogReady(page, '/');
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Notes from building for the modern web.',
      }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', {
        name: 'Building an accessible content pipeline',
      }),
    ).toBeVisible();

    await gotoBlogReady(page, ARTICLE_PATH);
    await expect(
      page.getByRole('heading', {
        level: 1,
        name: 'Building an accessible content pipeline',
      }),
    ).toBeVisible();
    const tableOfContents = page.getByRole('navigation', {
      name: 'On this page',
    });
    if (isMobile) {
      await expect(tableOfContents).toBeHidden();
    } else {
      await expect(tableOfContents).toBeVisible();
    }
    await expect(
      page.getByRole('list', { name: 'Article topics' }),
    ).toBeVisible();

    await gotoBlogReady(page, TAG_PATH);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Accessibility' }),
    ).toBeVisible();
    await expect(page.getByText('1 article filed under this topic.')).toBeVisible();
  });

  test('returns the blog not-found experience for an unknown article', async ({
    page,
  }) => {
    const response = await page.goto(blogUrl('/article-that-does-not-exist'), {
      waitUntil: 'domcontentloaded',
    });

    // App Router can stream `notFound()` after the initial document response,
    // which preserves the not-found UI and robots metadata but reports 200.
    expect(response?.status()).toBeLessThan(500);
    await expect(
      page.getByRole('heading', { name: 'That note is not here.' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Return to the blog' }),
    ).toHaveAttribute('href', '/');
  });

  test('supports keyboard skip navigation', async ({ page, browserName }) => {
    test.skip(
      browserName === 'webkit',
      'Safari requires Full Keyboard Access before Tab focuses links.',
    );
    await gotoBlogReady(page, '/');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('persists the selected theme on the independent blog origin', async ({ page }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await gotoBlogReady(page, '/');
    await page.evaluate(() => window.localStorage.removeItem('theme'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    const root = page.locator('html');
    await expect(root).toHaveAttribute('data-theme', 'light');
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(root).toHaveAttribute('data-theme', 'dark');

    await gotoBlogReady(page, '/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');
  });

  test('navigates between portfolio and blog as separate zones', async ({
    page,
  }) => {
    await gotoReady(page, '/');

    const mobileMenu = page.getByRole('button', {
      name: 'Open navigation menu',
    });
    if (await mobileMenu.isVisible()) {
      await mobileMenu.click();
    }

    const blogLink = page.locator('a[aria-label="Blog (opens in a new tab)"]:visible');
    const popupPromise = page.waitForEvent('popup');
    await blogLink.click();
    const blogPage = await popupPromise;
    await blogPage.waitForLoadState('domcontentloaded');
    await expect(blogPage).toHaveURL(`${BLOG_BASE_URL}/`);
    await expect(
      blogPage.getByRole('heading', {
        level: 1,
        name: 'Notes from building for the modern web.',
      }),
    ).toBeVisible();
    await expect(
      blogPage.getByRole('link', { name: 'Portfolio' }).first(),
    ).toHaveAttribute('href', new URL(page.url()).origin);
    await blogPage.close();
  });

  test('prevents horizontal page overflow at a mobile viewport', async ({
    page,
  }) => {
    await page.setViewportSize({ width: 390, height: 844 });

    for (const path of ['/', ARTICLE_PATH, TAG_PATH]) {
      await gotoBlogReady(page, path);
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(
        dimensions.clientWidth,
      );
    }
  });

  test('shows public likes and supports an anonymous like', async ({ page }) => {
    await gotoBlogReady(page, ARTICLE_PATH);

    const likeButton = page.getByRole('button', { name: /^Like/ });
    await expect(likeButton).toBeVisible();
    await likeButton.click();
    await expect(page.getByRole('button', { name: /^Liked/ })).toBeDisabled();
    await expect(page.getByText('Thanks for the like.')).toBeAttached();
  });
});

test.describe('Blog accessibility automation', () => {
  for (const [name, path] of [
    ['landing', '/'],
    ['article', ARTICLE_PATH],
    ['tag archive', TAG_PATH],
    ['not found', '/article-that-does-not-exist'],
  ] as const) {
    test(`${name} has no serious or critical axe violations`, async ({
      page,
    }) => {
      await page.goto(blogUrl(path), { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('main')).toBeVisible();
      await expectNoSeriousAxeViolations(page);
    });
  }
});
