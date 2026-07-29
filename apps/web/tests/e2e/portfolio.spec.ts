import { test, expect, type Page } from '@playwright/test';
import AxeBuilder from '@axe-core/playwright';

// ── Helpers ────────────────────────────────────────────────────
async function waitForPage(page: Page) {
  await page.goto('/');
  await page.waitForLoadState('networkidle');
}

// ── Navigation & Layout ────────────────────────────────────────
test.describe('Navigation', () => {
  test('renders navbar with all links', async ({ page }) => {
    await waitForPage(page);
    const nav = page.getByRole('navigation', { name: 'Main navigation' });
    await expect(nav).toBeVisible();

    for (const label of ['About', 'Experience', 'Skills', 'Certifications', 'Contact']) {
      await expect(nav.getByRole('link', { name: label })).toBeVisible();
    }
  });

  test('skip-to-main link is focusable and targets main content', async ({ page }) => {
    await waitForPage(page);
    // Tab to skip link
    await page.keyboard.press('Tab');
    const skipLink = page.getByRole('link', { name: /skip to main content/i });
    await expect(skipLink).toBeFocused();
    // Activating should navigate to #main-content
    await page.keyboard.press('Enter');
    const main = page.getByRole('main');
    await expect(main).toBeVisible();
  });

  test('theme toggle switches between dark and light', async ({ page }) => {
    await waitForPage(page);
    const html = page.locator('html');
    // Default is dark
    await expect(html).toHaveAttribute('data-theme', 'dark');

    const toggle = page.getByRole('button', { name: /switch to light mode/i });
    await toggle.click();
    await expect(html).toHaveAttribute('data-theme', 'light');

    const toggleBack = page.getByRole('button', { name: /switch to dark mode/i });
    await toggleBack.click();
    await expect(html).toHaveAttribute('data-theme', 'dark');
  });
});

// ── Hero Section ───────────────────────────────────────────────
test.describe('Hero Section', () => {
  test('renders headline and CTAs', async ({ page }) => {
    await waitForPage(page);
    await expect(page.getByRole('heading', { level: 1, name: /Dileep T/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /Get in touch/i })).toBeVisible();
    await expect(page.getByRole('link', { name: /View my work/i })).toBeVisible();
  });
});

// ── Experience Section ─────────────────────────────────────────
test.describe('Experience Timeline', () => {
  test('renders at least one role', async ({ page }) => {
    await waitForPage(page);
    await page.locator('#experience').scrollIntoViewIfNeeded();

    // First card should be expanded by default
    const firstCard = page.getByRole('button', { name: /Fidelity Investments/i }).first();
    await expect(firstCard).toBeVisible();
    await expect(firstCard).toHaveAttribute('aria-expanded', 'true');
  });

  test('can expand and collapse experience cards', async ({ page }) => {
    await waitForPage(page);
    await page.locator('#experience').scrollIntoViewIfNeeded();

    const boaButton = page.getByRole('button', { name: /Bank of America/i });
    await expect(boaButton).toHaveAttribute('aria-expanded', 'false');
    await boaButton.click();
    await expect(boaButton).toHaveAttribute('aria-expanded', 'true');
  });
});

// ── AI Chat Widget ─────────────────────────────────────────────
test.describe('AI Chat Widget', () => {
  test('opens chat dialog when trigger is clicked', async ({ page }) => {
    await waitForPage(page);
    const trigger = page.getByRole('button', { name: /open ai portfolio assistant/i });
    await trigger.click();

    const dialog = page.getByRole('dialog');
    await expect(dialog).toBeVisible();
    await expect(page.getByPlaceholder(/ask anything/i)).toBeFocused();
  });

  test('closes with Escape key', async ({ page }) => {
    await waitForPage(page);
    await page.getByRole('button', { name: /open ai portfolio assistant/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();
    await page.keyboard.press('Escape');
    await expect(page.getByRole('dialog')).not.toBeVisible();
  });

  test('renders suggested prompts and can click one', async ({ page }) => {
    await waitForPage(page);
    await page.getByRole('button', { name: /open ai portfolio assistant/i }).click();

    const prompt = page.getByRole('button', { name: /Micro Frontends/i });
    await expect(prompt).toBeVisible();
    await prompt.click();

    // The user message should appear in the chat log
    const log = page.getByRole('log');
    await expect(log.getByText(/Micro Frontends/i)).toBeVisible();
  });
});

// ── WCAG 2.1 AA Accessibility Audits ──────────────────────────
test.describe('Accessibility (WCAG 2.1 AA)', () => {
  test('home page has no automatically detectable violations', async ({ page }) => {
    await waitForPage(page);
    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('chat widget has no accessibility violations when open', async ({ page }) => {
    await waitForPage(page);
    await page.getByRole('button', { name: /open ai portfolio assistant/i }).click();
    await expect(page.getByRole('dialog')).toBeVisible();

    const results = await new AxeBuilder({ page })
      .withTags(['wcag2a', 'wcag2aa', 'wcag21a', 'wcag21aa'])
      .include('[role="dialog"]')
      .analyze();
    expect(results.violations).toEqual([]);
  });

  test('all images have alt text', async ({ page }) => {
    await waitForPage(page);
    const images = page.getByRole('img');
    const count = await images.count();
    for (let i = 0; i < count; i++) {
      const img = images.nth(i);
      const alt = await img.getAttribute('alt');
      // alt="" is acceptable for decorative images
      expect(alt).not.toBeNull();
    }
  });
});
