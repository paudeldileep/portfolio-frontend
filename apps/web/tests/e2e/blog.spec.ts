import { expect, test, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

const ARTICLE_PATH = '/blog/building-an-accessible-content-pipeline';
const TAG_PATH = '/blog/tag/accessibility';

async function gotoReady(page: Page, path: string) {
  const response = await page.goto(path, { waitUntil: 'domcontentloaded' });
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
    await gotoReady(page, '/blog');
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

    await gotoReady(page, ARTICLE_PATH);
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

    await gotoReady(page, TAG_PATH);
    await expect(
      page.getByRole('heading', { level: 1, name: 'Accessibility' }),
    ).toBeVisible();
    await expect(page.getByText('1 article filed under this topic.')).toBeVisible();
  });

  test('returns the blog not-found experience for an unknown article', async ({
    page,
  }) => {
    const response = await page.goto('/blog/article-that-does-not-exist', {
      waitUntil: 'domcontentloaded',
    });

    expect(response?.status()).toBe(404);
    await expect(
      page.getByRole('heading', { name: 'That note is not here.' }),
    ).toBeVisible();
    await expect(
      page.getByRole('link', { name: 'Return to the blog' }),
    ).toHaveAttribute('href', '/blog');
  });

  test('supports keyboard skip navigation', async ({ page, browserName }) => {
    test.skip(
      browserName === 'webkit',
      'Safari requires Full Keyboard Access before Tab focuses links.',
    );
    await gotoReady(page, '/blog');

    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: 'Skip to main content' });
    await expect(skipLink).toBeFocused();
    await page.keyboard.press('Enter');
    await expect(page.getByRole('main')).toBeFocused();
  });

  test('persists the selected theme across the hard zone boundary', async ({
    page,
  }) => {
    await page.emulateMedia({ colorScheme: 'light' });
    await gotoReady(page, '/blog');
    await page.evaluate(() => window.localStorage.removeItem('theme'));
    await page.reload({ waitUntil: 'domcontentloaded' });

    const root = page.locator('html');
    await expect(root).toHaveAttribute('data-theme', 'light');
    await page.getByRole('button', { name: 'Switch to dark mode' }).click();
    await expect(root).toHaveAttribute('data-theme', 'dark');

    await gotoReady(page, '/');
    await expect(page.locator('html')).toHaveAttribute('data-theme', 'dark');

    await gotoReady(page, '/blog');
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
    await expect(blogPage).toHaveURL(/\/blog$/);
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

    for (const path of ['/blog', ARTICLE_PATH, TAG_PATH]) {
      await gotoReady(page, path);
      const dimensions = await page.evaluate(() => ({
        clientWidth: document.documentElement.clientWidth,
        scrollWidth: document.documentElement.scrollWidth,
      }));
      expect(dimensions.scrollWidth).toBeLessThanOrEqual(
        dimensions.clientWidth,
      );
    }
  });
});

test.describe('Blog accessibility automation', () => {
  for (const [name, path] of [
    ['landing', '/blog'],
    ['article', ARTICLE_PATH],
    ['tag archive', TAG_PATH],
    ['not found', '/blog/article-that-does-not-exist'],
  ] as const) {
    test(`${name} has no serious or critical axe violations`, async ({
      page,
    }) => {
      await page.goto(path, { waitUntil: 'domcontentloaded' });
      await expect(page.getByRole('main')).toBeVisible();
      await expectNoSeriousAxeViolations(page);
    });
  }
});
